import Hero from "@/components/hero/Hero";
import Playground from "@/components/playground/Playground";
import Contact from "@/components/sections/Contact";
import Credentials from "@/components/sections/Credentials";
import Experience from "@/components/sections/Experience";
import Nav from "@/components/sections/Nav";
import Projects from "@/components/sections/Projects";
import Preloader from "@/components/sequence/Preloader";
import ScrollSequence from "@/components/sequence/ScrollSequence";
import Cursor from "@/components/ui/Cursor";
import Motion from "@/components/ui/Motion";

export default function Home() {
  return (
    <>
      <Preloader />
      <Motion />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <ScrollSequence />
        <Experience />
        <Projects />
        <Playground />
        <Credentials />
      </main>
      <Contact />
    </>
  );
}
