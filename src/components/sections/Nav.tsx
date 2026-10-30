const links = [
  { label: "Story", href: "#story" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Playground", href: "#playground" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  return (
    <header className="shell fixed inset-x-0 top-0 z-40 flex items-center justify-between py-6 mix-blend-difference">
      <a href="#top" className="font-display text-2xl" aria-label="Back to top">
        HP
      </a>
      <nav aria-label="Primary" className="hidden gap-8 md:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="eyebrow !text-ivory hover:opacity-60">
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
