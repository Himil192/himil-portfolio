import Hero from "@/components/hero/Hero";
import Playground from "@/components/playground/Playground";
import Contact from "@/components/sections/Contact";
import Credentials from "@/components/sections/Credentials";
import Experience from "@/components/sections/Experience";
import Nav from "@/components/sections/Nav";
import Projects from "@/components/sections/Projects";
import ScrollSequence from "@/components/sequence/ScrollSequence";
import Cursor from "@/components/ui/Cursor";
import Inspect from "@/components/ui/Inspect";
import Motion from "@/components/ui/Motion";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Motion />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <Experience />
        <Projects />
        <Credentials />
        <ScrollSequence />
        <Playground />
      </main>
      <Contact />
      <Inspect />
    </>
  );
}
