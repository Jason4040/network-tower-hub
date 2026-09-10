import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import TowerStage from "../components/tower/TowerStage";
import About from "../components/panels/About";
import Skills from "../components/panels/Skills";
import Projects from "../components/panels/Projects";
import Education from "../components/panels/Education";
import Certifications from "../components/panels/Certifications";
import CV from "../components/panels/CV";
import Contact from "../components/panels/Contact";
import { nodes, type NodeId } from "../data/profile";

const TITLE = "Irumva Jason | Networking & Cloud Security";
const DESCRIPTION =
  "Irumva Jason is a Networking and Communication Systems student in Kigali, Rwanda, building practical expertise in networking, infrastructure, network security and the path toward Cloud Security Engineering.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [active, setActive] = useState<NodeId | null>(null);

  const go = useCallback((id: NodeId) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as NodeId);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    nodes.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Fixed 3D infrastructure stage */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="false"
        role="presentation"
      >
        <div className="pointer-events-auto ml-auto h-full w-full lg:w-[52%]">
          <TowerStage activeNode={active} onSelect={go} />
        </div>
      </div>

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-20 focus:z-50 focus:border focus:border-accent focus:bg-background focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <Navigation active={active} onNavigate={go} />

      <main className="pointer-events-none relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6">
        <div className="pointer-events-auto lg:w-[52%]">
          <Hero onProjects={() => go("projects")} />
          <div className="pointer-events-none h-[42vh] lg:hidden" aria-hidden="true" />
          <About />
          <Skills />
          <Projects />
          <Education />
          <Certifications />
          <CV />
          <Contact />
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
