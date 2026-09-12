import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import TowerFallback from "./TowerFallback";
import type { ReactNode } from "react";
import type { NodeId } from "../../data/profile";

const TowerScene = lazy(() => import("./TowerScene"));

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function TowerStage({
  activeNode,
  onSelect,
  selectedIndex,
  renderCard,
}: {
  activeNode: NodeId;
  onSelect: (id: NodeId) => void;
  selectedIndex: number;
  renderCard: (id: NodeId) => ReactNode;
}) {
  const [mode, setMode] = useState<"loading" | "3d" | "fallback">("loading");
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqSmall = window.matchMedia("(max-width: 1024px)");
    const sync = () => {
      setReduced(mqReduce.matches);
      setCompact(mqSmall.matches);
    };
    sync();
    mqReduce.addEventListener("change", sync);
    mqSmall.addEventListener("change", sync);
    setMode(hasWebGL() ? "3d" : "fallback");
    return () => {
      mqReduce.removeEventListener("change", sync);
      mqSmall.removeEventListener("change", sync);
    };
  }, []);

  const content = useMemo(() => {
    if (mode === "fallback") return <TowerFallback />;
    if (mode === "loading") return null;
    return (
      <Suspense fallback={<TowerFallback />}>
        <TowerScene
          activeNode={activeNode}
          onSelect={onSelect}
          reduced={reduced}
          compact={compact}
          selectedIndex={selectedIndex}
          renderCard={renderCard}
        />
      </Suspense>
    );
  }, [mode, activeNode, onSelect, reduced, compact, selectedIndex, renderCard]);

  return <div className="h-full w-full">{content}</div>;
}
