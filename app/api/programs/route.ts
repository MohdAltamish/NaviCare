import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

if (process.env.GEMINI_API_KEY && process.env.GOOGLE_API_KEY) {
  delete process.env.GOOGLE_API_KEY;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are NaviCare, a US government benefits navigator.

You will receive a person's summary information. Your job is to reason carefully
about which federal and state benefit programs they may qualify for.

ELIGIBILITY RULES YOU KNOW:

SNAP (Food Assistance):
- Gross income must be at or below 130% of federal poverty level
- 130% FPL for household of 1: $1,580/mo | 2: $2,137 | 3: $2,694 | 4: $3,250
- Most states also allow categorical eligibility (SSI/TANF recipients auto-qualify)
- Apply at: benefits.gov/benefit/361

Medicaid:
- Adults up to 138% FPL in expansion states (most states)
- 138% FPL for household of 1: $1,732/mo | 2: $2,342 | 3: $2,952 | 4: $3,562
- Check state-specific rules — not all states expanded
- Apply at: healthcare.gov or state Medicaid office

CHIP (Children's Health Insurance):
- For families with children under 19 who earn too much for Medicaid
- Generally covers families up to 200-300% FPL depending on state
- Apply at: insurekidsnow.gov

Section 8 / Housing Choice Vouchers:
- Income must be below 50% of Area Median Income (AMI) for your county
- Waitlists are often long — apply early
- Apply at: hud.gov/program_offices/public_indian_housing

TANF (Temporary Assistance for Needy Families):
- For families with children under 18 (or pregnant women)
- Income limits vary significantly by state
- Apply at: benefits.gov/benefit/613

LIHEAP (Energy Assistance):
- For households that pay a high proportion of income on energy
- Income at or below 150% FPL or 60% of state median income
- Apply at: liheap.acf.hhs.gov

Unemployment Insurance:
- Must have lost job through no fault of your own
- Must have worked enough hours/weeks in "base period"
- Apply at state unemployment office

WIC (Women, Infants, Children):
- For pregnant women, new mothers, infants, children under 5
- Income at or below 185% FPL
- Apply at: fns.usda.gov/wic

Pell Grant:
- For undergraduate students from low-income families
- Based on FAFSA financial need determination
- Maximum $7,395/year

WIOA Job Training:
- For adults 18+ who are unemployed or underemployed
- Free job training and career services

Head Start:
- For children birth to age 5 from low-income families
- Income at or below 100% FPL

ACA Marketplace:
- Subsidized health insurance for those 100-400% FPL
- Apply at healthcare.gov

CCAP Childcare:
- Subsidized childcare for working families
- Must be working, in training, or in school

IMPORTANT RULES:
1. ALWAYS say "may qualify" or "likely qualifies" — NEVER say "you qualify"
2. Show your reasoning — explain WHICH rule applies to THEIR situation
3. Include the actual income threshold relevant to their household size
4. If a program is borderline, explain the uncertainty
5. Include state-specific notes where relevant
6. Identify 1-2 programs they likely do NOT qualify for and explain why

If a category_filter is provided, focus on programs in that category but still include
highly relevant programs from other categories.

Respond ONLY with valid JSON (no markdown, no preamble):
{
  "qualifying": [
    {
      "slug": "snap",
      "program_name": "SNAP (Food Assistance)",
      "category": "food",
      "reasoning": "Your household income...",
      "confidence": "likely",
      "apply_url": "https://...",
      "source": "benefits.gov"
    }
  ],
  "not_qualifying": [
    {
      "slug": "tanf",
      "program_name": "TANF (Cash Assistance)",
      "category": "family",
      "reasoning": "TANF requires...",
    }
  ]
}

Valid categories: "food", "health", "housing", "family", "unemployment", "utilities", "education", "transport"
Valid confidence values: "likely", "possible", "borderline"`;

export async function POST(req: NextRequest) {
  try {
    const { summary, category_filter } = await req.json();

    if (!summary) {
      return NextResponse.json(
        { error: "Missing user summary." },
        { status: 400 }
      );
    }

    const userMessage = `Here is the user's summary:
- State: ${summary.state || "Not specified"}
- Monthly household income: ${summary.income_range || "Not specified"}
- Household size: ${summary.household_size || "Not specified"}
- Has children: ${summary.has_children ? "Yes" : "No"}${summary.children_ages ? ` (ages: ${summary.children_ages.join(", ")})` : ""}
- Employment status: ${summary.employment_status || "Not specified"}
- Housing status: ${summary.housing_status || "Not specified"}
- Has health insurance: ${summary.has_health_insurance ? "Yes" : "No"}
- Other relevant factors: ${summary.other_flags?.join(", ") || "None specified"}
${category_filter ? `\nCategory filter: Focus on "${category_filter}" programs.` : ""}

Please analyze which benefit programs this person may qualify for and which they likely do not.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: userMessage,
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

    if (!parsed.qualifying || !Array.isArray(parsed.qualifying)) {
      throw new Error("Invalid response structure from AI");
    }

    // Ensure not_qualifying exists
    if (!parsed.not_qualifying) {
      parsed.not_qualifying = [];
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error in /api/programs:", error);
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
      { error: "Failed to generate benefits results. Please try again." },
      { status: 500 }
    );
  }
}
