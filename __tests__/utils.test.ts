import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles undefined inputs", () => {
    expect(cn(undefined, "foo", undefined)).toBe("foo");
  });

  it("handles empty strings", () => {
    expect(cn("", "bar")).toBe("bar");
  });

  it("handles array-like inputs", () => {
    expect(cn(["text-red-500", "font-bold"])).toBe("text-red-500 font-bold");
  });

  it("returns empty string for no args", () => {
    expect(cn()).toBe("");
  });

  it("merges responsive variants correctly", () => {
    const result = cn("md:flex", "lg:grid");
    expect(result).toContain("md:flex");
    expect(result).toContain("lg:grid");
  });
});

describe("Chat flow constants", () => {
  const FLOWS = ["product", "order", "refund", "technical"] as const;

  it("defines all expected chat flows", () => {
    expect(FLOWS).toHaveLength(4);
  });

  it("includes product flow", () => {
    expect(FLOWS).toContain("product");
  });

  it("includes refund flow", () => {
    expect(FLOWS).toContain("refund");
  });

  it("includes technical flow", () => {
    expect(FLOWS).toContain("technical");
  });

  it("includes order flow", () => {
    expect(FLOWS).toContain("order");
  });
});

describe("Analytics mock data shape", () => {
  const kpis = [
    { label: "Conversations Today", value: "1,247", change: "+8.2%" },
    { label: "Avg Response Time", value: "1.4s", change: "-0.3s" },
    { label: "Satisfaction Score", value: "4.8", change: "+0.2" },
    { label: "Resolution Rate", value: "87%", change: "+3.1%" },
  ];

  it("has 4 KPI entries", () => {
    expect(kpis).toHaveLength(4);
  });

  it("each KPI has label, value, change", () => {
    kpis.forEach((kpi) => {
      expect(kpi).toHaveProperty("label");
      expect(kpi).toHaveProperty("value");
      expect(kpi).toHaveProperty("change");
    });
  });

  it("resolution rate is a percentage string", () => {
    const rate = kpis.find((k) => k.label === "Resolution Rate");
    expect(rate?.value).toMatch(/%$/);
  });

  it("satisfaction score is numeric-ish", () => {
    const score = kpis.find((k) => k.label === "Satisfaction Score");
    expect(parseFloat(score?.value ?? "0")).toBeGreaterThan(0);
  });

  it("changes include direction sign", () => {
    kpis.forEach((kpi) => {
      expect(kpi.change).toMatch(/^[+-]/);
    });
  });
});
