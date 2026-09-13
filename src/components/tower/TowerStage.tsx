import { Component, lazy, Suspense, useLayoutEffect, useState, type ReactNode } from "react";
import TowerFallback from "./TowerFallback";
import type { NodeId } from "../../data/profile";

const loadTowerScene = () => import("./TowerScene");
const TowerScene = lazy(loadTowerScene);
if (typeof window !== "undefined") void loadTowerScene();

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

function ScenePlaceholder() {
  return <div className="absolute inset-0 h-full w-full bg-background" aria-hidden />;
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean; message: string }> {
  state = { failed: false, message: "" };

  static getDerivedStateFromError(error: Error) {
    return { failed: true, message: error?.message || "Tower scene failed" };
  }

  componentDidCatch(error: Error) {
    console.error(error);
    if (typeof window !== "undefined") {
      (window as Window & { __towerError?: string }).__towerError = `${error.message}\n${error.stack ?? ""}`;
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="absolute inset-0 h-full w-full" data-tower-error={this.state.message}>
          <TowerFallback />
        </div>
      );
    }
    return this.props.children;
  }
}

export default function TowerStage({
  activeNode,
  pinnedNode,
  onSelect,
  onHover,
  dark,
  photoUrl,
}: {
  activeNode: NodeId;
  pinnedNode: NodeId;
  onSelect: (id: NodeId) => void;
  onHover: (id: NodeId | null) => void;
  dark: boolean;
  photoUrl: string;
}) {
  const [mode, setMode] = useState<"boot" | "3d" | "fallback">("boot");
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
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

  if (mode === "fallback") return <TowerFallback />;
  if (mode === "boot") return <ScenePlaceholder />;

  return (
    <SceneErrorBoundary>
      <Suspense fallback={<ScenePlaceholder />}>
        <TowerScene
          activeNode={activeNode}
          pinnedNode={pinnedNode}
          onSelect={onSelect}
          onHover={onHover}
          reduced={reduced}
          compact={compact}
          dark={dark}
          photoUrl={photoUrl}
        />
      </Suspense>
    </SceneErrorBoundary>
  );
}
