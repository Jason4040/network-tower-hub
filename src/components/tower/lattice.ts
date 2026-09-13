import * as THREE from "three";

export const TOWER = {
  height: 22,
  sections: 13,
  baseWidth: 5.8,
  topWidth: 0.78,
  bands: 7,
  red: "#c62828",
  redDark: "#8e1c1c",
  white: "#efeae3",
  steel: "#8d8982",
  steelDark: "#4a4743",
  concrete: "#6e6a64",
};

export type InstancePose = {
  position: [number, number, number];
  quaternion: [number, number, number, number];
  scale: [number, number, number];
};

const CORNERS: Array<[number, number]> = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

const UP = new THREE.Vector3(0, 1, 0);

export function widthAt(y: number) {
  const t = Math.max(0, Math.min(1, y / TOWER.height));
  return THREE.MathUtils.lerp(TOWER.baseWidth, TOWER.topWidth, t ** 0.82);
}

export function bandKey(y: number): "red" | "white" {
  const band = Math.min(TOWER.bands - 1, Math.floor((Math.max(0, y) / TOWER.height) * TOWER.bands));
  return band % 2 === 0 ? "red" : "white";
}

export function corner(i: number, y: number) {
  const half = widthAt(y) / 2;
  const [sx, sz] = CORNERS[i] ?? [1, 1];
  return new THREE.Vector3(sx * half, y, sz * half);
}

export function memberPose(a: THREE.Vector3, b: THREE.Vector3, radiusScale: number): InstancePose {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = Math.max(dir.length(), 0.001);
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
  return {
    position: [mid.x, mid.y, mid.z],
    quaternion: [quat.x, quat.y, quat.z, quat.w],
    scale: [radiusScale, len, radiusScale],
  };
}

export function radialPoint(y: number, yaw: number, extra = 0): [number, number, number] {
  const r = widthAt(y) / 2 + extra;
  return [Math.cos(yaw) * r, y, Math.sin(yaw) * r];
}

export function nodePlacement(index: number, count: number, id?: string) {
  const extra = id === "about" ? 0.95 : 0.58;
  const y = nodeHeight(index, count);
  const angle = (index / Math.max(count, 1)) * Math.PI * 2 * 1.28 + 0.35;
  const [x, , z] = radialPoint(y, angle, extra);
  const face = radialPoint(y, angle, 0);
  const labelLift = id === "about" ? 0.92 : 0.24;
  const label: [number, number, number] = [
    x + Math.cos(angle) * 1.12,
    y + labelLift,
    z + Math.sin(angle) * 1.12,
  ];
  return { x, y, z, angle, face, label };
}

export function nodeHeight(index: number, count: number) {
  const top = TOWER.height - 0.85;
  const bottom = 3.6;
  if (count <= 1) return top;
  return top - index * ((top - bottom) / (count - 1));
}

export function buildLattice(compact: boolean) {
  const sections = compact ? 9 : TOWER.sections;
  const redLegs: InstancePose[] = [];
  const whiteLegs: InstancePose[] = [];
  const redBraces: InstancePose[] = [];
  const whiteBraces: InstancePose[] = [];
  const rungs: InstancePose[] = [];

  const push = (list: InstancePose[], pose: InstancePose) => {
    list.push(pose);
  };
  const paintPush = (red: InstancePose[], white: InstancePose[], pose: InstancePose, y: number) => {
    push(bandKey(y) === "red" ? red : white, pose);
  };

  const segH = TOWER.height / sections;

  for (let s = 0; s < sections; s += 1) {
    const y0 = s * segH;
    const y1 = y0 + segH;
    const yMid = (y0 + y1) / 2;
    for (let i = 0; i < 4; i += 1) {
      const j = (i + 1) % 4;
      const a0 = corner(i, y0);
      const a1 = corner(i, y1);
      const b0 = corner(j, y0);
      const b1 = corner(j, y1);
      paintPush(redLegs, whiteLegs, memberPose(a0, a1, 2.35), yMid);
      paintPush(redBraces, whiteBraces, memberPose(a0, b0, 1.25), y0);
      paintPush(redBraces, whiteBraces, memberPose(a0, b1, 1.05), yMid);
      paintPush(redBraces, whiteBraces, memberPose(b0, a1, 1.05), yMid);
      // Connector through the X-brace so diagonals meet a real joint.
      paintPush(redBraces, whiteBraces, memberPose(corner(i, yMid), corner(j, yMid), 1.2), yMid);
    }
    if (s % 2 === 0) {
      paintPush(redBraces, whiteBraces, memberPose(corner(0, y0), corner(2, y0), 0.95), y0);
      paintPush(redBraces, whiteBraces, memberPose(corner(1, y0), corner(3, y0), 0.95), y0);
    }
  }

  const topY = TOWER.height;
  for (let i = 0; i < 4; i += 1) {
    const j = (i + 1) % 4;
    paintPush(redBraces, whiteBraces, memberPose(corner(i, topY), corner(j, topY), 1.4), topY);
  }

  const footR = 3.55;
  for (let i = 0; i < 4; i += 1) {
    const [sx, sz] = CORNERS[i] ?? [1, 1];
    const foot = new THREE.Vector3(sx * footR, 0.02, sz * footR);
    const join = corner(i, 3.15);
    paintPush(redLegs, whiteLegs, memberPose(foot, join, 2.8), 1.4);
    const inner = corner(i, 0.08);
    paintPush(redBraces, whiteBraces, memberPose(foot, inner, 1.35), 0.4);
  }

  const ladderFace = 0;
  const rungCount = compact ? 28 : 42;
  for (let r = 0; r < rungCount; r += 1) {
    const y = 0.45 + r * ((TOWER.height - 1.2) / rungCount);
    const left = corner(ladderFace, y);
    const right = corner((ladderFace + 1) % 4, y);
    const t = 0.42;
    const a = left.clone().lerp(right, t);
    const b = left.clone().lerp(right, t + 0.16);
    rungs.push(memberPose(a, b, 0.7));
  }

  return { redLegs, whiteLegs, redBraces, whiteBraces, rungs };
}
