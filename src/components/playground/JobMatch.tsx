"use client";

import { FormEvent, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { sampleJob, site } from "@/content/site";
import { compareJob, MatchResult, summarize } from "@/lib/jobMatch";

const MAX_LENGTH = 20000;

export default function JobMatch() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<MatchResult>();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setResult(compareJob(text));
  };
  const trySample = () => {
    setText(sampleJob);
    setResult(compareJob(sampleJob));
  };

  const total = result ? result.matched.length + result.unfamiliar.length : 0;
  const subject = encodeURIComponent("A role that matches your portfolio");

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={submit}>
        <label htmlFor="job-text" className="text-sm text-ink/70">
          Job description
        </label>
        <textarea
          id="job-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={MAX_LENGTH}
          rows={11}
          placeholder="Paste the role you are hiring for"
          className="job-input mt-2"
        />
        <p className="mt-2 text-sm text-ink/70">
          Runs only in your browser. Nothing you paste is sent or saved.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="button button-foil">
            Check my fit
          </button>
          <button type="button" onClick={trySample} className="button button-ghost">
            Try a sample job
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {!result && (
          <p className="text-ink/70">
            Your result appears here, with evidence for every match and an honest list of what I
            have not used yet.
          </p>
        )}
        {result && total === 0 && (
          <p className="text-ink/70">
            I could not find any technical skills in that text. Try pasting the full description.
          </p>
        )}
        {result && total > 0 && (
          <div>
            <p className="font-display text-4xl">
              {result.matched.length} of {total} skills matched
            </p>
            {result.matched.length > 0 && (
              <ul className="mt-6 space-y-4">
                {result.matched.map((skill) => (
                  <li key={skill.name}>
                    <p className="eyebrow">{skill.name}</p>
                    <p className="mt-1 text-sm text-ink/70">{skill.evidence}</p>
                  </li>
                ))}
              </ul>
            )}
            {result.unfamiliar.length > 0 && (
              <div className="mt-6 border-t border-ink/10 pt-5">
                <p className="eyebrow">New to me</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {result.unfamiliar.map((skill) => (
                    <li key={skill.name} className="chip">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`mailto:${site.email}?subject=${subject}`} className="button button-foil">
                Talk to me about this role
              </a>
              <CopyButton text={summarize(result)} label="Copy result" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
