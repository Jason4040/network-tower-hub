import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import TowerStage from "../components/tower/TowerStage";
import TowerPortfolio, { CardContent } from "../components/TowerPortfolio";
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
  const [active, setActive] = useState<NodeId>("about");

  const go = useCallback((id: NodeId) => {
    setActive(id);
  }, []);
  const selectedIndex = Math.max(0, nodes.findIndex((node) => node.id === active));

  return (
    <main className="relative h-[100dvh] min-h-[640px] overflow-hidden bg-background">
      <h1 className="sr-only">Irumva Jason — Networking and Cloud Security Portfolio</h1>
      <div className="absolute inset-0 z-0" role="presentation">
        <TowerStage activeNode={active} onSelect={go} selectedIndex={selectedIndex} renderCard={(id) => <CardContent id={id} />} />
      </div>
      <TowerPortfolio active={active} onSelect={go} />
    </main>
  );
}
