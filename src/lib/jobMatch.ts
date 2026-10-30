import { matchSkills, site, unfamiliarSkills } from "@/content/site";

type Skill = { name: string; aliases: string[] };

export type MatchResult = { matched: typeof matchSkills; unfamiliar: typeof unfamiliarSkills };

export function mentions(text: string, { aliases }: Skill) {
  return aliases.some((alias) => {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
    return new RegExp(`(?<![\\w.+#-])${escaped}(?![\\w+#-])`, "i").test(text);
  });
}

export function compareJob(text: string): MatchResult {
  return {
    matched: matchSkills.filter((skill) => mentions(text, skill)),
    unfamiliar: unfamiliarSkills.filter((skill) => mentions(text, skill)),
  };
}

export function summarize({ matched, unfamiliar }: MatchResult) {
  const lines = [`${site.name}: ${matched.length} of ${matched.length + unfamiliar.length} skills matched`];
  if (matched.length > 0) lines.push(`Matched: ${matched.map((skill) => skill.name).join(", ")}`);
  if (unfamiliar.length > 0) lines.push(`New to me: ${unfamiliar.map((skill) => skill.name).join(", ")}`);
  lines.push(`Portfolio: ${site.url}`);
  return lines.join("\n");
}
