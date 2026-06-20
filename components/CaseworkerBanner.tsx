"use client";

export default function CaseworkerBanner() {
  return (
    <>
      {/* Desktop: inline card */}
      <div
        className="hidden md:block w-full rounded-xl p-6"
        style={{ backgroundColor: "var(--nc-green)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Want to talk to a real person?
            </h3>
            <p className="text-sm" style={{ color: "#BBF7D0" }}>
              A local caseworker can confirm your eligibility and help you apply
              — for free.
            </p>
          </div>
          <a
            href="https://www.findhelp.org"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: "transparent",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Find a Caseworker Near You →
          </a>
        </div>
      </div>

      {/* Mobile: fixed bottom banner */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4"
        style={{ backgroundColor: "var(--nc-green)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              Talk to a real person
            </p>
            <p className="text-xs truncate" style={{ color: "#BBF7D0" }}>
              Free caseworker help
            </p>
          </div>
          <a
            href="https://www.findhelp.org"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center rounded-lg px-4 py-2 text-xs font-semibold"
            style={{
              backgroundColor: "transparent",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            Find Help →
          </a>
        </div>
      </div>
    </>
  );
}
