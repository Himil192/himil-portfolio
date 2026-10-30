import type { Metadata } from "next";
import LostParticles from "@/components/ui/LostParticles";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `Page not found | ${site.name}` };

export default function NotFound() {
  return <LostParticles />;
}
