import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

if (process.env.GEMINI_API_KEY && process.env.GOOGLE_API_KEY) {
  delete process.env.GOOGLE_API_KEY;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function generateContentWithRetry(params: any, retries = 3, delayMs = 2000): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      const errStr = error instanceof Error ? error.message : String(error);
      const isQuota = errStr.toLowerCase().includes("quota") || 
                      errStr.includes("429") || 
                      errStr.toLowerCase().includes("limit") || 
                      errStr.toLowerCase().includes("exhausted");
      
      if (isQuota && attempt < retries) {
        console.warn(`[Gemini API] Rate limit hit. Retrying attempt ${attempt}/${retries} after ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs = delayMs * 1.5;
        continue;
      }
      throw error;
    }
  }
}

const SYSTEM_PROMPT = `You are NaviCare, a compassionate US government benefits navigator.
Your job is to have a natural conversation with someone to understand
their situation well enough to find the right benefit programs for them.

You have received their initial situation description. Now you must ask
follow-up questions to gather the specific information needed to determine
eligibility — but ONLY ask about things that are relevant to their situation.

CONVERSATION RULES:
1. Ask ONE question at a time. Never combine multiple questions.
2. React to what the user tells you. If they say they have kids, ask about
   their ages. If they mention a health condition, ask if they have insurance.
   Do not ask about irrelevant topics.
3. Keep a natural, warm tone. You are a knowledgeable friend, not a form.
4. Once you have enough information (usually 4-8 exchanges), generate results.
5. Never ask for Social Security numbers, full names, or precise addresses.

TOPICS TO COVER (only if relevant to their situation):
- Income: monthly household income range
- Employment: working, unemployed, self-employed, disability
- Family: number of people in household, ages of children if any
- Housing: renting, owning, homeless, facing eviction
- Health: insurance status, chronic conditions, pregnancy, disability
- Location: US state (always needed)
- Citizenship/immigration status (only if relevant — handle sensitively)

QUESTION FORMAT:
Always respond with a JSON object:
{
  "message": "The conversational text before the question (1-2 sentences, warm tone)",
  "question": {
    "question": "The specific question text",
    "type": "yesno | pills | multiselect | number | dropdown | text",
    "options": ["option1", "option2"],
    "placeholder": "hint text",
    "topic": "income | family | housing | health | location | other"
  },
  "topics_covered": ["income", "location"],
  "ready_for_results": false
}

When ready_for_results is true, also include:
{
  "ready_for_results": true,
  "message": "A warm summary of what you've learned and that you're ready to find programs",
  "question": null,
  "topics_covered": ["income", "family", "housing", "health", "location"],
  "summary": {
    "state": "Texas",
    "income_range": "under_2500",
    "household_size": 3,
    "has_children": true,
    "children_ages": [4, 7],
    "employment_status": "unemployed",
    "housing_status": "renting",
    "has_health_insurance": false,
    "other_flags": ["facing eviction", "single parent"]
  }
}

EXAMPLE PERSONALIZED QUESTION PATHS:

User says: "I lost my job and I have 2 kids"
→ Ask: "Sorry to hear that. Are you currently receiving any unemployment benefits?" (yesno)
→ Then: "How old are your kids?" (pills: Under 5 / 5-12 / 13-17 / Mixed ages)
→ Then: "Do you currently have health insurance for them?" (yesno)
→ Then: "What state do you live in?" (dropdown with US states)
→ Then: "What's your approximate monthly income right now?" (pills)
→ Ready for results

User says: "I'm pregnant and don't have health insurance"
→ Ask: "Congratulations! Is this your first child?" (yesno)
→ Then: "What state do you live in?" (dropdown with US states)
→ Then: "Are you currently working?" (pills: Full-time / Part-time / Not working)
→ Then: "What's your approximate monthly household income?" (pills)
→ Ready for results — focus on Medicaid, WIC, CHIP

User says: "I can't pay my rent and might get evicted"
→ Ask: "How far behind on rent are you?" (pills: 1 month / 2 months / 3+ months / Received eviction notice)
→ Then: "What state do you live in?" (dropdown)
→ Then: "Are you currently working?" (pills)
→ Then: "How many people live in your household?" (number)
→ Then: "What's your approximate monthly income?" (pills)
→ Ready for results — focus on rental assistance, Section 8, TANF

User says: "I need help with education" or "I want to go back to school"
→ Ask: "What kind of education are you looking for?" (pills: College/University / GED/High School Diploma / Job Training / English Classes)
→ Then: "How old are you?" (pills: 16-24 / 25-49 / 50+)
→ Then: "What state do you live in?" (dropdown)
→ Then: "What's your approximate monthly income?" (pills)
→ Ready for results — focus on Pell Grant, WIOA, Head Start, Adult Ed

IMPORTANT:
- NEVER say "you qualify" — always say "may qualify" or "likely qualifies"
- Do not ask more than 8 questions total
- If the user volunteers information in their answers, mark that topic as covered and skip asking about it
- For dropdown questions about state, always set options to an empty array (the UI will populate US states)
- For income questions, use pills with these options: ["Under $1,000/month", "$1,000-$2,500/month", "$2,500-$4,000/month", "Over $4,000/month"]`;

export async function POST(req: NextRequest) {
  try {
    const { messages, situation, topics_covered } = await req.json();

    if (!situation || typeof situation !== "string") {
      return NextResponse.json(
        { error: "Missing situation description." },
        { status: 400 }
      );
    }

    // Build conversation context for Gemini
    const conversationParts: string[] = [];

    // Add the initial situation
    conversationParts.push(`User's initial situation: "${situation}"`);

    if (topics_covered && topics_covered.length > 0) {
      conversationParts.push(`Topics already covered: ${topics_covered.join(", ")}`);
    }

    // Add message history
    if (messages && messages.length > 0) {
      conversationParts.push("\nConversation so far:");
      for (const msg of messages) {
        if (msg.role === "user") {
          conversationParts.push(`User: ${msg.content}`);
        } else {
          conversationParts.push(`NaviCare: ${msg.content}`);
        }
      }
    }

    conversationParts.push(
      "\nGenerate the next appropriate response. Remember to ask only ONE question at a time, and make it relevant to the user's specific situation. Respond ONLY with valid JSON."
    );

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: conversationParts.join("\n"),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text response from AI");
    }

    const parsed = JSON.parse(text);

    // Validate response structure
    if (!parsed.message || typeof parsed.ready_for_results !== "boolean") {
      throw new Error("Invalid response structure from AI");
    }

    // Ensure topics_covered exists
    if (!parsed.topics_covered) {
      parsed.topics_covered = topics_covered || [];
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error in /api/chat:", error);
    const errStr = error instanceof Error ? error.message : String(error);
    const isQuotaExceeded = errStr.toLowerCase().includes("quota") || 
                            errStr.includes("429") || 
                            errStr.toLowerCase().includes("limit") || 
                            errStr.toLowerCase().includes("exhausted");

    if (isQuotaExceeded) {
      return NextResponse.json(
        { error: "Gemini API rate limit exceeded. Please wait a few seconds and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
