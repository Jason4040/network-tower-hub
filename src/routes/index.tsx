import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import NodeAside from "../components/NodeAside";
import TowerPortfolio from "../components/TowerPortfolio";
import TowerStage from "../components/tower/TowerStage";
import { type NodeId } from "../data/profile";
import { useContent } from "../lib/content-context";
import { useTheme } from "../lib/theme";

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
  const { theme } = useTheme();
  const { content } = useContent();
  const [pinned, setPinned] = useState<NodeId>("about");
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [side, setSide] = useState<"left" | "right">("left");
  const [entered, setEntered] = useState(false);
  const [falling, setFalling] = useState<Array<{ key: number; id: NodeId; side: "left" | "right"; top?: number }>>(
    [],
  );
  const liveCard = useRef<HTMLElement | null>(null);
  const fallSeq = useRef(0);
  const pinnedRef = useRef(pinned);
  const sideRef = useRef(side);
  pinnedRef.current = pinned;
  sideRef.current = side;

  const go = useCallback((id: NodeId) => {
    const current = pinnedRef.current;
    if (current === id) return;
    const currentSide = sideRef.current;
    fallSeq.current += 1;
    setFalling((list) => [
      ...list.slice(-3),
      { key: fallSeq.current, id: current, side: currentSide, top: liveCard.current?.getBoundingClientRect().top },
    ]);
    setSide(currentSide === "left" ? "right" : "left");
    setEntered(true);
    setPinned(id);
  }, []);

  return (
    <main className="relative h-[145vh] min-h-[100dvh] bg-background">
      <h1 className="sr-only">Irumva Jason — Networking and Cloud Security Portfolio</h1>
      <div className="absolute inset-0 z-0 h-full w-full" role="presentation">
        <TowerStage
          activeNode={hovered ?? pinned}
          pinnedNode={pinned}
          onSelect={go}
          onHover={setHovered}
          dark={theme !== "light"}
          photoUrl={content.profile.photoUrl}
        />
      </div>
      <TowerPortfolio />
      {falling.map((card) => (
        <NodeAside
          key={`fall-${card.key}`}
          id={card.id}
          side={card.side}
          mode="fall"
          frozenTop={card.top}
          onFallEnd={() => setFalling((list) => list.filter((item) => item.key !== card.key))}
        />
      ))}
      <NodeAside
        key={pinned}
        id={pinned}
        side={side}
        arrive={entered}
        panelRef={(el) => {
          liveCard.current = el;
        }}
      />
      <p className="pointer-events-none fixed bottom-4 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
        DRAG TO TURN / PINCH TO ZOOM / SCROLL THE PAGE
      </p>
    </main>
  );
}
