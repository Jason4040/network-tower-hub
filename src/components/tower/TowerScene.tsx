import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useMemo, useRef, useState, memo, type ReactNode } from "react";
import * as THREE from "three";
import { nodes, type NodeId } from "../../data/profile";

const ACCENT = "#c2551f";
const STEEL = "#6b6862";
const DARK_STEEL = "#3a3835";

type SceneProps = {
  activeNode: NodeId;
  onSelect: (id: NodeId) => void;
  reduced: boolean;
  compact: boolean;
  selectedIndex: number;
};

const MAST_HEIGHT = 13;

/** Lattice mast: stacked rectangular sections with cross bracing. */
function Mast({ compact }: { compact: boolean }) {
  const sections = compact ? 7 : 10;
  const segH = MAST_HEIGHT / sections;

  const legMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#8b8880", metalness: 0.6, roughness: 0.5 }),
    [],
  );
  const braceMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: DARK_STEEL, metalness: 0.6, roughness: 0.6 }),
    [],
  );
  const postGeo = useMemo(() => new THREE.CylinderGeometry(0.055, 0.055, segH, 6), [segH]);
  const braceGeo = useMemo(() => new THREE.BoxGeometry(0.035, 1, 0.035), []);

  const width = (y: number) => 0.85 - (y / MAST_HEIGHT) * 0.42;

  const items: React.ReactElement[] = [];
  for (let s = 0; s < sections; s++) {
    const y0 = s * segH;
    const yMid = y0 + segH / 2;
    const w = width(yMid);
    // three vertical posts (triangular mast)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      items.push(
        <mesh
          key={`p-${s}-${i}`}
          geometry={postGeo}
          material={legMat}
          position={[Math.cos(a) * w, yMid, Math.sin(a) * w]}
          castShadow
        />,
      );
      // horizontal ring member
      const a2 = ((i + 1) / 3) * Math.PI * 2;
      const p1 = new THREE.Vector3(Math.cos(a) * w, y0, Math.sin(a) * w);
      const p2 = new THREE.Vector3(Math.cos(a2) * w, y0, Math.sin(a2) * w);
      items.push(<Member key={`h-${s}-${i}`} a={p1} b={p2} geo={braceGeo} mat={braceMat} />);
      // diagonal brace
      const p3 = new THREE.Vector3(Math.cos(a2) * w, y0 + segH, Math.sin(a2) * w);
      items.push(<Member key={`d-${s}-${i}`} a={p1} b={p3} geo={braceGeo} mat={braceMat} />);
    }
  }
  return <group>{items}</group>;
}

function Member({
  a,
  b,
  geo,
  mat,
}: {
  a: THREE.Vector3;
  b: THREE.Vector3;
  geo: THREE.BufferGeometry;
  mat: THREE.Material;
}) {
  const { pos, quat, len } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(b, a);
    const l = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return { pos: new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), quat: q, len: l };
  }, [a, b]);
  return (
    <mesh geometry={geo} material={mat} position={pos} quaternion={quat} scale={[1, len, 1]} />
  );
}

function Dish({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#a9a59d" metalness={0.35} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.55, 6]} />
        <meshStandardMaterial color={DARK_STEEL} metalness={0.7} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.22, 0.16, 0.22]} />
        <meshStandardMaterial color="#2c2a28" metalness={0.4} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Base() {
  return (
    <group>
      {/* platform */}
      <mesh position={[0, -0.08, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.1, 3.3, 0.16, 6]} />
        <meshStandardMaterial color="#26241f" metalness={0.2} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.75, 2.82, 6]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
      {/* three support legs */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 3;
        const top = new THREE.Vector3(Math.cos(a) * 0.8, 3.4, Math.sin(a) * 0.8);
        const bottom = new THREE.Vector3(Math.cos(a) * 2.5, 0.02, Math.sin(a) * 2.5);
        return (
          <group key={i}>
            <Member
              a={top}
              b={bottom}
              geo={new THREE.CylinderGeometry(0.09, 0.11, 1, 8)}
              mat={new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.7, roughness: 0.5 })}
            />
            {/* footing */}
            <mesh position={[bottom.x, 0.12, bottom.z]} castShadow>
              <boxGeometry args={[0.5, 0.24, 0.5]} />
              <meshStandardMaterial color="#312e2a" metalness={0.2} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
      {/* equipment cabinet */}
      <mesh position={[1.5, 0.42, 0.9]} castShadow>
        <boxGeometry args={[0.7, 0.68, 0.45]} />
        <meshStandardMaterial color="#2a2825" metalness={0.35} roughness={0.75} />
      </mesh>
      <mesh position={[1.5, 0.6, 1.13]}>
        <boxGeometry args={[0.08, 0.04, 0.01]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
    </group>
  );
}

function NodeMarker({
  id,
  code,
  label,
  y,
  angle,
  active,
  onSelect,
  reduced,
  compact,
}: {
  id: NodeId;
  code: string;
  label: string;
  y: number;
  angle: number;
  active: boolean;
  onSelect: (id: NodeId) => void;
  reduced: boolean;
  compact: boolean;
  renderCard: (id: NodeId) => ReactNode;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const r = 0.95 - (y / MAST_HEIGHT) * 0.4;
  const pos: [number, number, number] = [Math.cos(angle) * r, y, Math.sin(angle) * r];

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const on = active || hover;
    const base = on ? 1.5 : 0.85;
    const pulse = reduced ? 0 : Math.sin(clock.elapsedTime * 2 + y) * (on ? 0.25 : 0.1);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.color.setStyle(on ? "#e8712b" : ACCENT);
    const s = base + pulse * 0.15;
    ref.current.scale.setScalar(s);
  });

  return (
    <group position={pos}>
      <mesh>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#33302c" metalness={0.5} roughness={0.6} />
      </mesh>
      <mesh ref={ref} position={[Math.cos(angle) * 0.13, 0, Math.sin(angle) * 0.13]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
      {compact ? null : (
      <Html
        position={[Math.cos(angle) * 0.4, 0.02, Math.sin(angle) * 0.4]}
        center={false}
        distanceFactor={16}
        zIndexRange={[10, 0]}
      >
        <button
          type="button"
          onClick={() => { setPinned(true); onSelect(id); }}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          className="flex min-h-[28px] items-center gap-2 whitespace-nowrap border px-2 py-1 text-left transition-colors"
          style={{
            borderColor: active || hover ? ACCENT : "rgba(255,255,255,0.18)",
            background: "rgba(12,12,11,0.78)",
            color: active || hover ? "#f2f0ed" : "rgba(240,238,235,0.65)",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.12em",
          }}
          aria-label={`Go to ${label} section`}
        >
          <span style={{ color: ACCENT }}>{code}</span>
          <span>{label}</span>
        </button>
        {(hover || pinned) && (
          <div
            className="pointer-events-auto mt-2 w-[min(22rem,calc(100vw-2rem))] max-h-[52vh] overflow-y-auto border border-accent bg-background/95 p-4 text-sm leading-relaxed text-foreground shadow-2xl backdrop-blur-md"
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => { if (!pinned) setHover(false); }}
          >
            <div className="mb-3 flex items-baseline gap-2 border-b border-border pb-2">
              <span className="font-mono text-[10px] text-accent">{code}</span>
              <strong className="font-display text-sm tracking-[0.08em]">{label}</strong>
            </div>
            <div className="text-foreground/85">{renderCard(id)}</div>
          </div>
        )}
      </Html>
      )}
    </group>
  );
}

function Tower({ activeNode, onSelect, reduced, compact, selectedIndex, renderCard }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const target = useRef({ y: compact ? 6 : 5.5, rot: 0 });

  useFrame(({ clock }, delta) => {
    const idle = reduced ? 0 : Math.sin(clock.elapsedTime * 0.32) * 0.08;
    target.current.rot = -0.5 - selectedIndex * ((Math.PI * 2) / nodes.length) + idle;
    target.current.y = compact ? 6 : 5.5;
    const dt = Math.min(delta, 0.05);
    const k = 1 - Math.exp(-2.5 * dt);
    if (group.current) {
      group.current.rotation.y += (target.current.rot - group.current.rotation.y) * k;
    }
    const camY = target.current.y;
    const camZ = compact ? 38 : 30;
    camera.position.y += (camY - camera.position.y) * k;
    camera.position.z += (camZ - camera.position.z) * k;
    camera.position.x += ((compact ? 0 : 1.2) - camera.position.x) * k;
    camera.lookAt(0, camY - (compact ? 1 : 3), 0);
  });

  const nodeAngles = useMemo(() => nodes.map((_, i) => (i / nodes.length) * Math.PI * 2 * 1.4), []);

  return (
    <group ref={group} position={[0, -6, 0]}>
      <Base />
      <Mast compact={compact} />
      {/* top antenna */}
      <mesh position={[0, MAST_HEIGHT + 1.1, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 2.2, 6]} />
        <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, MAST_HEIGHT + 2.25, 0]}>
        <sphereGeometry args={[0.075, 10, 8]} />
        <meshBasicMaterial color="#e8712b" />
      </mesh>
      {/* dishes & sector antennas */}
      <Dish position={[0.95, MAST_HEIGHT - 1.6, 0.4]} rotation={[Math.PI / 2.4, 0, -0.5]} scale={0.9} />
      <Dish position={[-0.9, MAST_HEIGHT - 3.6, -0.5]} rotation={[Math.PI / 2.2, 0, 2.6]} scale={1.15} />
      <Dish position={[0.2, MAST_HEIGHT - 6.2, -1.0]} rotation={[Math.PI / 2.3, 0, 3.6]} scale={0.75} />
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.4;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.95, MAST_HEIGHT - 0.5, Math.sin(a) * 0.95]}>
            <boxGeometry args={[0.14, 1.1, 0.28]} />
            <meshStandardMaterial color="#d6d3cd" metalness={0.2} roughness={0.8} />
          </mesh>
        );
      })}
      {/* cable run */}
      <mesh position={[0.35, MAST_HEIGHT / 2, 0.35]}>
        <cylinderGeometry args={[0.03, 0.03, MAST_HEIGHT - 0.5, 5]} />
        <meshStandardMaterial color="#1f1d1b" roughness={0.95} />
      </mesh>
      {nodes.map((n, i) => (
        <NodeMarker
          key={n.id}
          id={n.id}
          code={n.code}
          label={n.label}
          y={1.8 + i * ((MAST_HEIGHT - 3.4) / (nodes.length - 1))}
          angle={nodeAngles[i] ?? 0}
          active={activeNode === n.id}
          onSelect={onSelect}
          reduced={reduced}
          compact={compact}
          renderCard={renderCard}
        />
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.1, 0]} receiveShadow>
      <circleGeometry args={[40, 48]} />
      <meshStandardMaterial color="#131211" roughness={1} metalness={0} />
    </mesh>
  );
}

function TowerScene(props: SceneProps) {
  return (
    <Canvas
      shadows={!props.compact}
      dpr={[1, props.compact ? 1.5 : 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, position: [1.2, 5.2, props.compact ? 40 : 30] }}
      frameloop="always"
    >
      <color attach="background" args={["#0e0d0c"]} />
      <fog attach="fog" args={["#0e0d0c", 34, 80]} />
      <ambientLight intensity={0.35} color="#8d8880" />
      <hemisphereLight args={["#6d6a62", "#0b0a09", 1.1]} />
      <directionalLight
        position={[8, 16, 6]}
        intensity={3.1}
        color="#cfcabf"
        castShadow={!props.compact}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-12, 7, -6]} intensity={0.9} color="#9a948c" />
      <pointLight position={[0, 2, 4]} intensity={12} distance={14} color="#c2551f" />
      <Ground />
      <Tower {...props} />
    </Canvas>
  );
}

export default memo(TowerScene);
