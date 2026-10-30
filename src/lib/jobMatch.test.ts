import { describe, expect, it } from "vitest";
import { sampleJob } from "@/content/site";
import { compareJob, mentions, summarize } from "./jobMatch";

const names = (skills: { name: string }[]) => skills.map((skill) => skill.name);

describe("mentions", () => {
  const react = { name: "React", aliases: ["react", "react.js"] };

  it("matches any alias, ignoring case", () => {
    expect(mentions("Strong REACT skills", react)).toBe(true);
    expect(mentions("Built with React.js", react)).toBe(true);
  });

  it("only matches whole words", () => {
    expect(mentions("Reactor and reactive streams", react)).toBe(false);
  });

  it("allows punctuation after a word", () => {
    expect(mentions("You know React.", react)).toBe(true);
  });

  it("treats aliases with symbols literally", () => {
    expect(mentions("A CI/CD pipeline", { name: "CI/CD", aliases: ["ci/cd"] })).toBe(true);
    expect(mentions("A CIxCD pipeline", { name: "CI/CD", aliases: ["ci/cd"] })).toBe(false);
  });
});

describe("compareJob", () => {
  it("returns nothing for empty text", () => {
    expect(compareJob("")).toEqual({ matched: [], unfamiliar: [] });
  });

  it("separates skills I have from skills I have not used", () => {
    const result = compareJob("React and Vue with Docker");
    expect(names(result.matched)).toEqual(["React"]);
    expect(names(result.unfamiliar)).toEqual(["Vue", "Docker"]);
  });

  it("matches the sample job honestly", () => {
    const result = compareJob(sampleJob);
    expect(names(result.matched)).toContain("Next.js");
    expect(names(result.unfamiliar)).toEqual(["GraphQL", "Jest"]);
  });

  it("gives every match its evidence", () => {
    for (const skill of compareJob(sampleJob).matched) expect(skill.evidence).not.toBe("");
  });
});

describe("summarize", () => {
  it("creates a short shareable summary", () => {
    const summary = summarize(compareJob("React and Vue"));
    expect(summary).toContain("1 of 2 skills matched");
    expect(summary).toContain("Matched: React");
    expect(summary).toContain("New to me: Vue");
    expect(summary).toContain("Portfolio:");
  });
});
