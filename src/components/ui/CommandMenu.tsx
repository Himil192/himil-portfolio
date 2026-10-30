"use client";

import { KeyboardEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { navLinks, site } from "@/content/site";
import { changeTheme } from "@/lib/theme";

type Command = { label: string; run: () => void };

const subscribeNothing = () => () => {};
const isMac = () => /mac/i.test(navigator.platform);

function goTo(href: string) {
  // Clicking the real link keeps smooth scrolling and hash behaviour identical to the nav.
  document.querySelector<HTMLAnchorElement>(`a[href="${href}"]`)?.click();
}

function download() {
  const link = document.createElement("a");
  link.href = site.resume;
  link.download = site.resumeFilename;
  link.click();
}

const commands: Command[] = [
  ...navLinks.map((link) => ({ label: `Go to ${link.label}`, run: () => goTo(link.href) })),
  { label: "Copy email address", run: () => void navigator.clipboard.writeText(site.email) },
  { label: "Download resume", run: download },
  { label: "Use light theme", run: () => changeTheme("light") },
  { label: "Use dark theme", run: () => changeTheme("dark") },
  { label: "Use system theme", run: () => changeTheme("system") },
];

export default function CommandMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const mac = useSyncExternalStore(subscribeNothing, isMac, () => false);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return commands.filter((command) => command.label.toLowerCase().includes(term));
  }, [query]);

  const open = () => {
    setQuery("");
    setSelected(0);
    dialog.current?.showModal();
  };
  const run = (command?: Command) => {
    if (!command) return;
    dialog.current?.close();
    command.run();
  };

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      if (dialog.current?.open) dialog.current.close();
      else open();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onInputKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setSelected((index) => (index + step + visible.length) % Math.max(visible.length, 1));
    }
    if (event.key === "Enter") run(visible[selected]);
  };

  return (
    <>
      <button type="button" onClick={open} className="command-hint" aria-haspopup="dialog">
        <span className="sr-only">Open command menu</span>
        <kbd aria-hidden>{mac ? "⌘K" : "Ctrl K"}</kbd>
      </button>
      <dialog
        ref={dialog}
        aria-label="Command menu"
        className="command-menu"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0);
          }}
          onKeyDown={onInputKey}
          placeholder="Type a command"
          role="combobox"
          aria-expanded
          aria-label="Search commands"
          aria-controls="command-list"
          aria-activedescendant={visible[selected] ? `command-${selected}` : undefined}
          className="command-input"
        />
        <ul id="command-list" role="listbox" aria-label="Commands" className="command-list">
          {visible.map((command, index) => (
            <li
              key={command.label}
              id={`command-${index}`}
              role="option"
              aria-selected={index === selected}
              onClick={() => run(command)}
              onPointerMove={() => setSelected(index)}
              className="command-item"
            >
              {command.label}
            </li>
          ))}
          {visible.length === 0 && <li className="command-empty">No matching command</li>}
        </ul>
      </dialog>
    </>
  );
}
