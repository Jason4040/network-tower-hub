import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, memo, type MutableRefObject } from "react";
import * as THREE from "three";
import { nodes, type NodeId } from "../../data/profile";
import {
  bandKey,
  buildLattice,
  memberPose,
  nodePlacement,
  radialPoint,
  TOWER,
  widthAt,
  type InstancePose,
} from "./lattice";

function absorbSourceTags(ctor: { prototype?: object } | undefined) {
  const proto = ctor?.prototype as { data?: unknown; __nthData?: unknown } | undefined;
  if (!proto || Object.prototype.hasOwnProperty.call(proto, "__nthDataBag")) return;
  Object.defineProperty(proto, "__nthDataBag", { value: true });
  Object.defineProperty(proto, "data", {
    configurable: true,
    enumerable: false,
    get() {
      if (!this.__nthData) this.__nthData = {};
      return this.__nthData;
    },
    set(value: unknown) {
      this.__nthData = typeof value === "object" && value !== null ? value : { value };
    },
  });
}

[
  THREE.Object3D,
  THREE.BufferGeometry,
  THREE.Material,
  THREE.Fog,
  THREE.Color,
  THREE.Texture,
  THREE.Camera,
].forEach((ctor) => absorbSourceTags(ctor));

type SceneProps = {
  activeNode: NodeId;
  pinnedNode: NodeId;
  onSelect: (id: NodeId) => void;
  onHover: (id: NodeId | null) => void;
  reduced: boolean;
  compact: boolean;
  dark: boolean;
  photoUrl: string;
};

type LabelMap = Partial<Record<NodeId, HTMLButtonElement | null>>;
type LeaderMap = Partial<Record<NodeId, { path: SVGPathElement | null; dot: SVGCircleElement | null }>>;
type CalloutRefs = {
  group: SVGGElement | null;
  under: SVGPathElement | null;
  path: SVGPathElement | null;
  start: SVGCircleElement | null;
  end: SVGRectElement | null;
};

const UNIT_CYL = new THREE.CylinderGeometry(0.05, 0.05, 1, 6);
const UNIT_BOX = new THREE.BoxGeometry(0.05, 1, 0.05);
const TMP_N = new THREE.Vector3();
const TMP_O = new THREE.Vector3();

function poseBetween(a: [number, number, number], b: [number, number, number], thick: number) {
  return memberPose(new THREE.Vector3(...a), new THREE.Vector3(...b), thick);
}

function InstancedMembers({
  poses,
  color,
  metalness,
  roughness,
  geometry,
  castShadow = false,
}: {
  poses: InstancePose[];
  color: string;
  metalness: number;
  roughness: number;
  geometry: THREE.BufferGeometry;
  castShadow?: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    poses.forEach((pose, index) => {
      dummy.position.set(...pose.position);
      dummy.quaternion.set(...pose.quaternion);
      dummy.scale.set(...pose.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [poses]);

  if (poses.length === 0) return null;

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, poses.length]} castShadow={castShadow}>
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </instancedMesh>
  );
}

function Lattice({ compact }: { compact: boolean }) {
  const data = useMemo(() => buildLattice(compact), [compact]);
  return (
    <group>
      <InstancedMembers
        poses={data.redLegs}
        color={TOWER.red}
        metalness={0.28}
        roughness={0.42}
        geometry={UNIT_CYL}
        castShadow
      />
      <InstancedMembers
        poses={data.whiteLegs}
        color={TOWER.white}
        metalness={0.22}
        roughness={0.38}
        geometry={UNIT_CYL}
        castShadow
      />
      <InstancedMembers poses={data.redBraces} color={TOWER.redDark} metalness={0.3} roughness={0.46} geometry={UNIT_BOX} />
      <InstancedMembers
        poses={data.whiteBraces}
        color={TOWER.white}
        metalness={0.22}
        roughness={0.4}
        geometry={UNIT_BOX}
      />
      <InstancedMembers poses={data.rungs} color="#5c5852" metalness={0.55} roughness={0.4} geometry={UNIT_CYL} />
    </group>
  );
}

function Clamp({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  return (
    <mesh position={position} rotation={[0, yaw, 0]}>
      <boxGeometry args={[0.22, 0.18, 0.3]} />
      <meshStandardMaterial color="#3a3733" metalness={0.62} roughness={0.4} />
    </mesh>
  );
}

function MicrowaveDish({
  position,
  yaw,
  pitch = -0.16,
  size,
}: {
  position: [number, number, number];
  yaw: number;
  pitch?: number;
  size: number;
}) {
  const points = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 14; i += 1) {
      const t = i / 14;
      const ang = t * 1.05;
      pts.push(new THREE.Vector2(Math.sin(ang) * size, (1 - Math.cos(ang)) * size * 0.42));
    }
    return pts;
  }, [size]);

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.08, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.16, 8]} />
        <meshStandardMaterial color={TOWER.steelDark} metalness={0.72} roughness={0.32} />
      </mesh>
      <group rotation={[0, 0, Math.PI / 2 + pitch]}>
        <mesh>
          <latheGeometry args={[points, 20]} />
          <meshStandardMaterial color="#d5d1ca" metalness={0.52} roughness={0.28} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, size * 0.28, 0]}>
          <cylinderGeometry args={[0.025, 0.025, size * 0.42, 6]} />
          <meshStandardMaterial color={TOWER.steelDark} metalness={0.75} roughness={0.35} />
        </mesh>
        <mesh position={[0, size * 0.48, 0]}>
          <coneGeometry args={[0.06, 0.1, 8]} />
          <meshStandardMaterial color="#2f2d2a" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function SectorAntenna({
  position,
  yaw,
  height = 1.55,
}: {
  position: [number, number, number];
  yaw: number;
  height?: number;
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0.12, 0, 0]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.14, height, 0.52]} />
        <meshStandardMaterial color="#f0ece6" metalness={0.12} roughness={0.55} />
      </mesh>
      <mesh position={[0.02, 0, 0]}>
        <boxGeometry args={[0.08, height * 0.7, 0.12]} />
        <meshStandardMaterial color="#4c4944" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function OmniAntenna({ position, height = 1.35 }: { position: [number, number, number]; height?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.045, 0.05, height, 8]} />
        <meshStandardMaterial color="#f2eee8" metalness={0.15} roughness={0.45} />
      </mesh>
      <mesh position={[0, height + 0.08, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#d0ccc6" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function GpsAntenna({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.24, 6]} />
        <meshStandardMaterial color={TOWER.steel} metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.11, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ece8e2" metalness={0.2} roughness={0.45} />
      </mesh>
    </group>
  );
}

function Yagi({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  const elements = [0.18, 0.28, 0.36, 0.3, 0.22];
  return (
    <group position={position} rotation={[0, yaw, 0.1]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />
        <meshStandardMaterial color={TOWER.steelDark} metalness={0.7} roughness={0.4} />
      </mesh>
      {elements.map((len, i) => (
        <mesh key={i} position={[0.28 - i * 0.14, 0, 0]}>
          <boxGeometry args={[0.02, len, 0.02]} />
          <meshStandardMaterial color="#cfcbc4" metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Beacon({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshBasicMaterial color="#ff2d2d" />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#3a3835" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Platform({ y }: { y: number }) {
  const w = widthAt(y) + 0.2;
  return (
    <mesh position={[0, y, 0]}>
      <boxGeometry args={[w, 0.09, w]} />
      <meshStandardMaterial
        color={bandKey(y) === "red" ? TOWER.redDark : TOWER.white}
        metalness={0.28}
        roughness={0.48}
      />
    </mesh>
  );
}

function Hardware({ compact }: { compact: boolean }) {
  const top = TOWER.height;
  const mounts = useMemo(() => {
    const arms: InstancePose[] = [];
    const add = (a: [number, number, number], b: [number, number, number], thick = 1.55) => {
      arms.push(poseBetween(a, b, thick));
    };

    const dishes: Array<{ y: number; yaw: number; reach: number }> = [
      { y: top - 3.4, yaw: 0.4, reach: 0.95 },
      { y: top - 5.1, yaw: 3.5, reach: 1.15 },
      { y: top - 7.4, yaw: 2.4, reach: 0.88 },
      { y: top - 9.8, yaw: -0.7, reach: 0.82 },
    ];
    if (!compact) dishes.push({ y: top - 12.2, yaw: 0.95, reach: 0.75 });
    dishes.forEach(({ y, yaw, reach }) => add(radialPoint(y, yaw, 0), radialPoint(y, yaw, reach), 1.7));

    [0, 1, 2].forEach((i) => {
      const a = (i / 3) * Math.PI * 2 + 0.2;
      const y = top - 0.55;
      add(radialPoint(y, a, 0), radialPoint(y, a, 0.28), 1.35);
    });
    [0, 1, 2].forEach((i) => {
      const a = (i / 3) * Math.PI * 2 + 1.2;
      const y = top - 2.05;
      add(radialPoint(y, a, 0), radialPoint(y, a, 0.24), 1.3);
    });

    add(radialPoint(top - 1.15, 0.85, 0), radialPoint(top - 1.15, 0.85, 0.32), 1.1);
    add(radialPoint(top - 1.35, 2.4, 0), radialPoint(top - 1.35, 2.4, 0.32), 1.1);
    add(radialPoint(top - 6.2, 0.3, 0), radialPoint(top - 6.2, 0.3, 0.42), 1.15);
    add(radialPoint(top - 10.4, 3.4, 0), radialPoint(top - 10.4, 3.4, 0.38), 1.15);

    return arms;
  }, [compact, top]);

  return (
    <group>
      <Platform y={6.2} />
      <Platform y={12.1} />
      <Platform y={18.4} />
      <InstancedMembers poses={mounts} color={TOWER.steelDark} metalness={0.72} roughness={0.32} geometry={UNIT_CYL} />
      <mesh position={[0, TOWER.height + 1.35, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 2.7, 8]} />
        <meshStandardMaterial color={TOWER.steel} metalness={0.8} roughness={0.32} />
      </mesh>
      <Beacon position={[0, top + 2.75, 0]} />
      <OmniAntenna position={[0.18, top + 0.05, 0.16]} height={1.6} />
      <OmniAntenna position={[-0.2, top + 0.05, -0.12]} height={1.25} />
      <OmniAntenna position={[0.02, top + 0.05, -0.22]} height={0.95} />

      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.2;
        const y = top - 0.55;
        const attach = radialPoint(y, a, 0);
        const pos = radialPoint(y, a, 0.28);
        return (
          <group key={`sec-a-${i}`}>
            <Clamp position={attach} yaw={a} />
            <SectorAntenna position={pos} yaw={a + Math.PI} height={1.7} />
          </group>
        );
      })}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 1.2;
        const y = top - 2.05;
        const attach = radialPoint(y, a, 0);
        const pos = radialPoint(y, a, 0.24);
        return (
          <group key={`sec-b-${i}`}>
            <Clamp position={attach} yaw={a} />
            <SectorAntenna position={pos} yaw={a + Math.PI} height={1.25} />
          </group>
        );
      })}

      <Clamp position={radialPoint(top - 1.15, 0.85, 0)} yaw={0.85} />
      <GpsAntenna position={radialPoint(top - 1.15, 0.85, 0.32)} />
      <Clamp position={radialPoint(top - 1.35, 2.4, 0)} yaw={2.4} />
      <GpsAntenna position={radialPoint(top - 1.35, 2.4, 0.32)} />

      <Clamp position={radialPoint(top - 3.4, 0.4, 0)} yaw={0.4} />
      <MicrowaveDish position={radialPoint(top - 3.4, 0.4, 0.95)} yaw={0.4} size={compact ? 0.72 : 0.92} />
      <Clamp position={radialPoint(top - 5.1, 3.5, 0)} yaw={3.5} />
      <MicrowaveDish position={radialPoint(top - 5.1, 3.5, 1.15)} yaw={3.5} pitch={-0.28} size={1.15} />
      <Clamp position={radialPoint(top - 7.4, 2.4, 0)} yaw={2.4} />
      <MicrowaveDish position={radialPoint(top - 7.4, 2.4, 0.88)} yaw={2.4} size={0.78} />
      <Clamp position={radialPoint(top - 9.8, -0.7, 0)} yaw={-0.7} />
      <MicrowaveDish position={radialPoint(top - 9.8, -0.7, 0.82)} yaw={-0.7} size={0.7} />
      {!compact ? (
        <>
          <Clamp position={radialPoint(top - 12.2, 0.95, 0)} yaw={0.95} />
          <MicrowaveDish position={radialPoint(top - 12.2, 0.95, 0.75)} yaw={0.95} size={0.62} />
        </>
      ) : null}

      <Yagi position={radialPoint(top - 6.2, 0.3, 0.42)} yaw={0.3} />
      <Yagi position={radialPoint(top - 10.4, 3.4, 0.38)} yaw={3.4} />

      <Beacon position={[0.55, 14.2, 0.55]} />
      <Beacon position={[-0.6, 8.4, -0.55]} />

      <mesh position={[widthAt(11) / 2 - 0.05, 11, widthAt(11) / 2 - 0.05]}>
        <cylinderGeometry args={[0.06, 0.06, TOWER.height - 0.8, 6]} />
        <meshStandardMaterial color="#1f1d1b" roughness={0.95} />
      </mesh>
      <mesh position={[widthAt(11) / 2 + 0.08, 11, widthAt(11) / 2 - 0.18]}>
        <cylinderGeometry args={[0.045, 0.045, TOWER.height - 1.1, 6]} />
        <meshStandardMaterial color="#2b2926" roughness={0.95} />
      </mesh>
    </group>
  );
}

function Base() {
  const footR = 3.55;
  const corners: Array<[number, number]> = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  return (
    <group>
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[6.4, 6.8, 0.22, 8]} />
        <meshStandardMaterial color="#3a3834" metalness={0.12} roughness={0.92} />
      </mesh>
      {corners.map(([sx, sz], i) => (
        <group key={i}>
          <mesh position={[sx * footR, 0.18, sz * footR]}>
            <boxGeometry args={[0.85, 0.36, 0.85]} />
            <meshStandardMaterial color="#6c6862" metalness={0.08} roughness={0.95} />
          </mesh>
          <mesh position={[sx * footR, 0.4, sz * footR]}>
            <boxGeometry args={[0.55, 0.1, 0.55]} />
            <meshStandardMaterial color="#4e4b46" metalness={0.2} roughness={0.8} />
          </mesh>
        </group>
      ))}
      <mesh position={[2.35, 0.72, 1.55]}>
        <boxGeometry args={[1.15, 1.28, 0.72]} />
        <meshStandardMaterial color="#2c2a27" metalness={0.3} roughness={0.72} />
      </mesh>
      <mesh position={[2.35, 1.1, 1.92]}>
        <boxGeometry args={[0.12, 0.05, 0.02]} />
        <meshBasicMaterial color="#c2551f" />
      </mesh>
      <mesh position={[-2.2, 0.55, 1.7]}>
        <boxGeometry args={[0.95, 0.95, 0.62]} />
        <meshStandardMaterial color="#32302c" metalness={0.28} roughness={0.75} />
      </mesh>
      <mesh position={[2.1, 0.38, -2.05]}>
        <boxGeometry args={[0.7, 0.55, 0.48]} />
        <meshStandardMaterial color="#2a2825" metalness={0.25} roughness={0.8} />
      </mesh>
    </group>
  );
}

function AboutPortrait({ url, yaw }: { url: string; yaw: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    const texture = loader.load(url, (map) => {
      if (cancelled) return;
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = 4;
      const mesh = meshRef.current;
      if (!mesh) return;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.map = map;
      material.needsUpdate = true;
    });
    return () => {
      cancelled = true;
      texture.dispose();
    };
  }, [url]);

  return (
    <group rotation={[0, yaw, 0]}>
      <mesh ref={meshRef} position={[0.02, 0, 0]}>
        <planeGeometry args={[1.05, 1.32]} />
        <meshBasicMaterial color="#2f2d2a" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function NodeMarker({
  id,
  index,
  total,
  active,
  photoUrl,
}: {
  id: NodeId;
  index: number;
  total: number;
  active: boolean;
  photoUrl: string;
}) {
  const place = nodePlacement(index, total, id);
  const painted = bandKey(place.y) === "red" ? TOWER.red : TOWER.white;
  const arm = useMemo(
    () => poseBetween(place.face, [place.x, place.y, place.z], id === "about" ? 1.8 : 1.45),
    [id, place.face, place.x, place.y, place.z],
  );

  return (
    <group>
      <mesh position={arm.position} quaternion={arm.quaternion} scale={arm.scale}>
        <cylinderGeometry args={[0.05, 0.05, 1, 6]} />
        <meshStandardMaterial color={TOWER.steelDark} metalness={0.7} roughness={0.35} />
      </mesh>
      <Clamp position={place.face} yaw={place.angle} />
      <group position={[place.x, place.y, place.z]}>
        {id === "about" ? (
          <AboutPortrait key={photoUrl} url={photoUrl} yaw={place.angle + Math.PI} />
        ) : (
          <mesh>
            <boxGeometry args={[0.28, 0.28, 0.28]} />
            <meshStandardMaterial color="#2f2d2a" metalness={0.45} roughness={0.55} />
          </mesh>
        )}
        <mesh position={[Math.cos(place.angle) * 0.18, id === "about" ? 0.78 : 0.22, Math.sin(place.angle) * 0.18]}>
          <sphereGeometry args={[id === "about" ? 0.08 : 0.07, 10, 8]} />
          <meshBasicMaterial color={active ? "#ff7a3c" : painted === TOWER.red ? "#ffd6c8" : "#c2551f"} />
        </mesh>
        <mesh position={[Math.cos(place.angle) * 0.42, id === "about" ? 0.58 : 0.02, Math.sin(place.angle) * 0.42]} rotation={[0, place.angle, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.46]} />
          <meshStandardMaterial color="#1f1d1b" metalness={0.35} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

function Lights({ dark, compact }: { dark: boolean; compact: boolean }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.42 : 0.76} color={dark ? "#8d8880" : "#f0ebe3"} />
      <hemisphereLight args={[dark ? "#6d6a62" : "#f4f0ea", dark ? "#0b0a09" : "#9b948a", dark ? 1.05 : 0.85]} />
      <directionalLight
        position={[9, 18, 7]}
        intensity={dark ? 2.85 : 2.15}
        color={dark ? "#cfcabf" : "#fff7ee"}
        castShadow={!compact}
        shadow-mapSize={[512, 512]}
        shadow-camera-near={2}
        shadow-camera-far={60}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={18}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-12, 8, -6]} intensity={dark ? 0.9 : 0.65} color={dark ? "#9a948c" : "#d7d2ca"} />
    </>
  );
}

function Ground({ dark }: { dark: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.22, 0]} receiveShadow>
      <circleGeometry args={[36, 32]} />
      <meshStandardMaterial
        color={dark ? "#131211" : "#c9c3b8"}
        roughness={dark ? 0.28 : 0.78}
        metalness={dark ? 0.22 : 0.04}
      />
    </mesh>
  );
}

function WheelScrollPassthrough() {
  const gl = useThree((state) => state.gl);

  useLayoutEffect(() => {
    const element = gl.domElement;
    const onWheel = (event: WheelEvent) => {
      const pinchZoom = event.ctrlKey || event.metaKey;
      if (pinchZoom) return;
      event.stopImmediatePropagation();
      window.scrollBy({ top: event.deltaY, left: event.deltaX, behavior: "auto" });
    };
    element.addEventListener("wheel", onWheel, { capture: true, passive: false });
    return () => element.removeEventListener("wheel", onWheel, { capture: true });
  }, [gl]);

  return null;
}

function CameraSetup({ compact }: { compact: boolean }) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    if (compact) {
      camera.position.set(6, 12, 52);
      camera.lookAt(0, 10, 0);
    } else {
      camera.position.set(-2.5, 12.5, 58);
      camera.lookAt(1.6, 10, 0);
    }
  }, [camera, compact]);
  return null;
}

function OverlaySync({
  labels,
  leaders,
  callout,
  pinnedNode,
  activeNode,
}: {
  labels: MutableRefObject<LabelMap>;
  leaders: MutableRefObject<LeaderMap>;
  callout: MutableRefObject<CalloutRefs>;
  pinnedNode: NodeId;
  activeNode: NodeId;
}) {
  const { camera, size, gl } = useThree();

  useFrame(() => {
    if (!camera) return;
    const total = nodes.length;
    const canvas = gl.domElement.getBoundingClientRect();

    for (let index = 0; index < total; index += 1) {
      const node = nodes[index];
      if (!node) continue;
      const el = labels.current[node.id];
      const leader = leaders.current[node.id];
      const { x, y, z, label } = nodePlacement(index, total, node.id);
      TMP_O.set(x, y, z).project(camera);
      TMP_N.set(...label).project(camera);
      const visible = TMP_N.z > -1 && TMP_N.z < 1;
      const lx = (TMP_N.x * 0.5 + 0.5) * size.width;
      const ly = (-TMP_N.y * 0.5 + 0.5) * size.height;
      const ox = (TMP_O.x * 0.5 + 0.5) * size.width;
      const oy = (-TMP_O.y * 0.5 + 0.5) * size.height;

      if (el && el.isConnected) {
        el.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(-50%, -50%)`;
        el.style.opacity = visible ? "1" : "0";
        el.style.pointerEvents = visible ? "auto" : "none";
      }

      if (leader?.path && leader.dot) {
        const active = activeNode === node.id;
        leader.path.setAttribute("d", `M ${ox} ${oy} L ${lx} ${ly}`);
        leader.path.setAttribute("data-active", active ? "true" : "false");
        leader.dot.setAttribute("cx", String(ox));
        leader.dot.setAttribute("cy", String(oy));
        leader.dot.setAttribute("data-active", active ? "true" : "false");
        const group = leader.path.parentElement;
        if (group instanceof SVGGElement) group.style.opacity = visible ? "1" : "0";
      }
    }

    const call = callout.current;
    const card = document.querySelector<HTMLElement>('[data-node-card="live"]');
    const labelEl = labels.current[pinnedNode];
    if (!call.group || !call.path || !call.under || !call.start || !call.end) return;
    if (!card || !labelEl?.isConnected) {
      call.group.style.opacity = "0";
      return;
    }

    const lr = labelEl.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    const labelVisible = Number.parseFloat(labelEl.style.opacity || "1") > 0.08 && lr.width > 1;
    if (!labelVisible || cr.width < 1) {
      call.group.style.opacity = "0";
      return;
    }

    const local = (vx: number, vy: number) => ({ x: vx - canvas.left, y: vy - canvas.top });
    const mobile = window.innerWidth < 768;
    let x1: number;
    let y1: number;
    let x2: number;
    let y2: number;
    let d: string;
    if (mobile) {
      const from = local(lr.left + lr.width / 2, lr.bottom);
      const to = local(cr.left + cr.width / 2, cr.top);
      x1 = from.x;
      y1 = from.y;
      x2 = to.x;
      y2 = to.y;
      const midY = (y1 + y2) / 2;
      d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
    } else {
      const cardOnLeft = cr.left + cr.width / 2 < window.innerWidth / 2;
      const labelMidY = lr.top + lr.height / 2;
      const attachY = Math.max(cr.top + 18, Math.min(labelMidY, cr.bottom - 18));
      const from = local(cardOnLeft ? lr.left : lr.right, labelMidY);
      const to = local(cardOnLeft ? cr.right : cr.left, attachY);
      x1 = from.x;
      y1 = from.y;
      x2 = to.x;
      y2 = to.y;
      const elbow = x1 + (cardOnLeft ? -22 : 22);
      d = `M ${x1} ${y1} L ${elbow} ${y1} L ${elbow} ${y2} L ${x2} ${y2}`;
    }
    call.under.setAttribute("d", d);
    call.path.setAttribute("d", d);
    call.start.setAttribute("cx", String(x1));
    call.start.setAttribute("cy", String(y1));
    call.end.setAttribute("x", String(x2 - 3));
    call.end.setAttribute("y", String(y2 - 3));
    call.group.dataset.ready = "true";
    call.group.style.opacity = "1";
  });

  return null;
}

function Scene({
  activeNode,
  pinnedNode,
  reduced,
  compact,
  dark,
  photoUrl,
  labels,
  leaders,
  callout,
}: SceneProps & {
  labels: MutableRefObject<LabelMap>;
  leaders: MutableRefObject<LeaderMap>;
  callout: MutableRefObject<CalloutRefs>;
}) {
  return (
    <>
      <WheelScrollPassthrough />
      <color attach="background" args={[dark ? "#0e0d0c" : "#d8d3cb"]} />
      <fog attach="fog" args={[dark ? "#0e0d0c" : "#d8d3cb", dark ? 38 : 42, 95]} />
      <Lights dark={dark} compact={compact} />
      <Ground dark={dark} />
      <group>
        <Base />
        <Lattice compact={compact} />
        <Hardware compact={compact} />
        {nodes.map((node, index) => (
          <NodeMarker
            key={node.id}
            id={node.id}
            index={index}
            total={nodes.length}
            active={activeNode === node.id}
            photoUrl={photoUrl}
          />
        ))}
      </group>
      <OverlaySync
        labels={labels}
        leaders={leaders}
        callout={callout}
        pinnedNode={pinnedNode}
        activeNode={activeNode}
      />
      <CameraSetup compact={compact} />
      <OrbitControls
        makeDefault
        enableDamping={!reduced}
        dampingFactor={0.08}
        enablePan
        enableZoom
        minDistance={compact ? 18 : 22}
        maxDistance={110}
        minPolarAngle={0.12}
        maxPolarAngle={Math.PI / 2.08}
        target={compact ? [0, 10, 0] : [1.6, 10, 0]}
        rotateSpeed={0.85}
        zoomSpeed={0.9}
        panSpeed={0.6}
      />
    </>
  );
}

function TowerScene(props: SceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<LabelMap>({});
  const leaders = useRef<LeaderMap>({});
  const callout = useRef<CalloutRefs>({
    group: null,
    under: null,
    path: null,
    start: null,
    end: null,
  });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const apply = () => {
      if (el.clientWidth > 1 && el.clientHeight > 1) setReady(true);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="absolute inset-0 h-full w-full">
      {ready ? (
        <Canvas
          shadows={!props.compact}
          dpr={[1, props.compact ? 1.25 : 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
          camera={{
            fov: 30,
            position: props.compact ? [6, 12, 52] : [-2.5, 12.5, 58],
            near: 0.1,
            far: 250,
          }}
          frameloop="always"
          style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = props.dark ? 1.05 : 1.12;
            gl.shadowMap.type = THREE.PCFShadowMap;
            gl.domElement.style.width = "100%";
            gl.domElement.style.height = "100%";
            gl.domElement.style.touchAction = "none";
          }}
          onPointerMissed={() => props.onHover(null)}
        >
          <Scene {...props} labels={labels} leaders={leaders} callout={callout} />
        </Canvas>
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-10">
        <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {nodes.map((node) => (
            <g
              key={node.id}
              style={{ opacity: 0 }}
              ref={(group) => {
                if (!group) {
                  delete leaders.current[node.id];
                  return;
                }
                leaders.current[node.id] = {
                  path: group.querySelector("path") as SVGPathElement | null,
                  dot: group.querySelector("circle") as SVGCircleElement | null,
                };
              }}
            >
              <path fill="none" strokeLinecap="square" className="node-leader-line" />
              <circle r="2.2" className="node-leader-dot" />
            </g>
          ))}
          <g
            key={props.pinnedNode}
            className="node-callout"
            style={{ opacity: 0 }}
            ref={(group) => {
              callout.current.group = group;
              callout.current.under = group?.querySelector("[data-callout='under']") as SVGPathElement | null;
              callout.current.path = group?.querySelector("[data-callout='line']") as SVGPathElement | null;
              callout.current.start = group?.querySelector("[data-callout='start']") as SVGCircleElement | null;
              callout.current.end = group?.querySelector("[data-callout='end']") as SVGRectElement | null;
            }}
          >
            <path data-callout="under" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
            <path data-callout="line" fill="none" pathLength={1} strokeLinecap="square" strokeLinejoin="miter" />
            <circle data-callout="start" r="2.7" />
            <rect data-callout="end" width="6" height="6" />
          </g>
        </svg>
        {nodes.map((node) => {
          const active = props.activeNode === node.id;
          return (
            <button
              key={node.id}
              ref={(el) => {
                labels.current[node.id] = el;
              }}
              type="button"
              data-node-label={node.id}
              onPointerEnter={() => props.onHover(node.id)}
              onPointerLeave={() => props.onHover(null)}
              onClick={() => props.onSelect(node.id)}
              className="pointer-events-auto absolute left-0 top-0 whitespace-nowrap border px-2 py-1 text-left"
              style={{
                transform: "translate3d(-9999px, -9999px, 0)",
                borderColor: active ? "#c2551f" : "rgba(255,255,255,0.22)",
                background: "color-mix(in oklab, var(--background) 82%, transparent)",
                color: "var(--foreground)",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.12em",
              }}
              aria-label={`Open ${node.label} card`}
            >
              <span style={{ color: "#c2551f" }}>{node.code}</span>
              <span className="ml-2">{node.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(TowerScene);
