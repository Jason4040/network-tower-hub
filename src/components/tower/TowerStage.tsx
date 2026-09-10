import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import TowerFallback from "./TowerFallback";
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
}: {
  activeNode: NodeId | null;
  onSelect: (id: NodeId) => void;
}) {
  const [mode, setMode] = useState<"loading" | "3d" | "fallback">("loading");
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const progress = useRef(0);

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

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.body.scrollHeight - window.innerHeight;
        progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const content = useMemo(() => {
    if (mode === "fallback") return <TowerFallback />;
    if (mode === "loading") return null;
    return (
      <Suspense fallback={<TowerFallback />}>
        <TowerScene
          progress={progress}
          activeNode={activeNode}
          onSelect={onSelect}
          reduced={reduced}
          compact={compact}
        />
      </Suspense>
    );
  }, [mode, activeNode, onSelect, reduced, compact]);

  return <div className="h-full w-full">{content}</div>;
}
