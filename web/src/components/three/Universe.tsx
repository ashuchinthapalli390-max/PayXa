"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { sceneStore, type Shape } from "./sceneStore";
import { facing, getShape, tints } from "./shapes";

const CRIMSON = new THREE.Color("#d90429");
const NEON = new THREE.Color("#ff4265");
const HOT = new THREE.Color("#ff9db6");

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.85)");
  grad.addColorStop(0.6, "rgba(255,255,255,0.15)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));
const sideOffset = (side: string, w: number) => (side === "right" ? w * 0.24 : side === "left" ? -w * 0.24 : 0);

/* ───────────────── Morphing particle field ───────────────── */

const vert = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uStretch;
  uniform float uScanY;
  uniform float uScanOn;
  uniform float uTime;
  varying vec3 vColor;
  varying float vGlow;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float g = uScanOn * smoothstep(0.22, 0.0, abs(position.y - uScanY));
    float twinkle = 0.9 + 0.1 * sin(uTime * 2.0 + position.x * 7.0 + position.y * 5.0);
    vGlow = g;
    gl_PointSize = uSize * aSize * uPixelRatio * (1.0 + uStretch + g * 1.4) * twinkle / -mv.z;
    vColor = aColor;
  }
`;
const frag = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uTint;
  uniform float uTintAmt;
  varying vec3 vColor;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 c = mix(vColor, uTint, uTintAmt) + vGlow * vec3(1.0, 0.75, 0.8);
    gl_FragColor = vec4(c, a * uOpacity * (1.0 + vGlow));
  }
`;

const SCAN_H = 1.75;
/** Smaller dots where the silhouette needs to read crisply. */
const sizeMul: Partial<Record<Shape, number>> = { qr: 0.42, card: 0.7, check: 0.8, rupee: 0.75, payxa: 0.75 };

function ScannerRig({ group }: { group: React.RefObject<THREE.Group | null> }) {
  const rig = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const brackets = useMemo(() => {
    const m = new THREE.LineBasicMaterial({ color: NEON, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
    const s = 2.15;
    const l = 0.55;
    const corners: [number, number][] = [
      [-1, 1],
      [1, 1],
      [-1, -1],
      [1, -1],
    ];
    return corners.map(([sx, sy]) => {
      const pts = [new THREE.Vector3(sx * s, sy * (s - l), 0.2), new THREE.Vector3(sx * s, sy * s, 0.2), new THREE.Vector3(sx * (s - l), sy * s, 0.2)];
      return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m);
    });
  }, []);
  const beamMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: NEON } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
        fragmentShader: `uniform vec3 uColor; varying vec2 vUv; void main(){ float core = smoothstep(0.06,0.0,abs(vUv.y-0.5)); float halo = smoothstep(0.5,0.0,abs(vUv.y-0.5))*0.35; float edge = smoothstep(0.0,0.08,vUv.x)*smoothstep(1.0,0.92,vUv.x); gl_FragColor = vec4(uColor + core*0.6, (core+halo)*edge); }`,
      }),
    [],
  );
  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const s = sceneStore.get();
    const g = group.current;
    if (!rig.current || !beam.current || !g) return;
    const on = s.shape === "qr";
    const k = damp(rig.current.scale.x, on ? 1 : 0.001, 3, dt);
    rig.current.scale.setScalar(k);
    rig.current.visible = k > 0.02;
    const y = Math.sin(clock.getElapsedTime() * 1.15) * SCAN_H;
    beam.current.position.y = y;
  });
  return (
    <group ref={rig}>
      {brackets.map((b, i) => (
        <primitive key={i} object={b} />
      ))}
      <mesh ref={beam} position={[0, 0, 0.25]} material={beamMat}>
        <planeGeometry args={[4.6, 0.55]} />
      </mesh>
    </group>
  );
}

function Particles({ count }: { count: number }) {
  const { viewport, gl } = useThree();
  const group = useRef<THREE.Group>(null);
  const current = useRef<Shape>("qr");
  const t0 = useRef(0);
  const burst = useRef(0);
  const tintTarget = useRef(new THREE.Color("#ffffff"));

  const { geo, speeds, dirs, mat } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const start = getShape("qr", count).slice();
    for (let i = 0; i < start.length; i++) start[i] *= 6 * Math.random(); // fly in from a scatter
    g.setAttribute("position", new THREE.BufferAttribute(start, 3));
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    const dv = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      sizes[i] = 0.45 + Math.random() * Math.random() * 1.6;
      sp[i] = 0.55 + Math.random() * 1.1;
      c.copy(r < 0.55 ? CRIMSON : r < 0.85 ? NEON : HOT);
      if (r > 0.95) c.set("#ffffff");
      colors.set([c.r, c.g, c.b], i * 3);
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      dv.set([Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), Math.cos(v)], i * 3);
    }
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    const m = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSize: { value: 48 },
        uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.75) },
        uOpacity: { value: 0.9 },
        uStretch: { value: 0 },
        uScanY: { value: 0 },
        uScanOn: { value: 0 },
        uTime: { value: 0 },
        uTint: { value: new THREE.Color("#ffffff") },
        uTintAmt: { value: 0 },
      },
    });
    return { geo: g, speeds: sp, dirs: dv, mat: m };
  }, [count, gl]);

  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const s = sceneStore.get();
    const t = clock.getElapsedTime();
    if (s.shape !== current.current) {
      current.current = s.shape;
      t0.current = t;
      burst.current = 1;
    }
    burst.current *= Math.exp(-dt * 2.4);
    const target = getShape(s.shape, count);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const ramp = Math.min(1, (t - t0.current) * 0.9);
    const isGrid = s.shape === "grid";
    const isTunnel = s.shape === "tunnel";
    const b = burst.current * 1.8;
    for (let i = 0; i < count; i++) {
      const k = 1 - Math.exp(-dt * 2.8 * speeds[i] * (0.35 + ramp));
      const i3 = i * 3;
      const tx = target[i3] + dirs[i3] * b;
      let ty = target[i3 + 1] + dirs[i3 + 1] * b;
      let tz = target[i3 + 2] + dirs[i3 + 2] * b;
      if (isGrid) ty += Math.sin(tx * 0.9 + t * 1.2) * 0.32 + Math.cos(tz * 0.7 + t) * 0.28;
      if (isTunnel) tz = ((target[i3 + 2] + 22 + t * 6 * speeds[i]) % 28) - 22;
      arr[i3] += (tx - arr[i3]) * k;
      arr[i3 + 1] += (ty - arr[i3 + 1]) * k;
      if (isTunnel && Math.abs(tz - arr[i3 + 2]) > 10) arr[i3 + 2] = tz;
      else arr[i3 + 2] += (tz - arr[i3 + 2]) * k;
    }
    pos.needsUpdate = true;

    const g = group.current;
    if (!g) return;
    const mobile = viewport.aspect < 0.9;
    g.position.x = damp(g.position.x, mobile ? 0 : sideOffset(s.side, viewport.width), 2.2, dt);
    g.position.y = damp(g.position.y, isGrid ? -0.2 : 0, 2.2, dt);
    const vel = Math.min(Math.abs(s.velocity), 60);
    if (facing[s.shape]) {
      const TAU = Math.PI * 2;
      const ry = ((((g.rotation.y + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
      const sway = s.shape === "qr" || s.shape === "card" ? 0.42 : 0.18;
      g.rotation.y = damp(ry, Math.sin(t * 0.35) * sway + s.pointerX * 0.3, 2, dt);
      g.rotation.x = damp(g.rotation.x, (isGrid ? 0.25 : Math.sin(t * 0.27) * 0.12) - s.pointerY * 0.18, 2, dt);
      g.rotation.z = damp(g.rotation.z, s.shape === "card" ? -0.12 : 0, 2, dt);
    } else {
      g.rotation.y += dt * (0.14 + vel * 0.014);
      g.rotation.x = damp(g.rotation.x, 0.25 + s.pointerY * 0.2 + s.progress * 0.6, 2, dt);
      g.rotation.z = damp(g.rotation.z, 0, 2, dt);
    }
    const fit = mobile ? 0.74 : Math.min(1, viewport.width / 10.5);
    const sc = fit * (s.shape === "payxa" && mobile ? 0.55 : 1) * (1 + burst.current * 0.08);
    g.scale.setScalar(damp(g.scale.x, sc, 3, dt));

    const centerDim = s.side === "center" && !isTunnel && s.shape !== "payxa" && s.shape !== "check" ? 0.55 : 1;
    const u = mat.uniforms;
    u.uOpacity.value = damp(u.uOpacity.value, (mobile ? 0.55 : 0.92) * centerDim, 3, dt);
    u.uStretch.value = damp(u.uStretch.value, vel * 0.012 + burst.current * 0.6, 4, dt);
    u.uTime.value = t;
    u.uSize.value = damp(u.uSize.value, (sizeMul[s.shape] ?? 1) * 48, 3, dt);
    u.uScanOn.value = damp(u.uScanOn.value, s.shape === "qr" ? 1 : 0, 3, dt);
    u.uScanY.value = Math.sin(t * 1.15) * SCAN_H;
    const tint = tints[s.shape];
    if (tint) tintTarget.current.setRGB(tint[0], tint[1], tint[2]);
    (u.uTint.value as THREE.Color).lerp(tintTarget.current, 1 - Math.exp(-dt * 3));
    u.uTintAmt.value = damp(u.uTintAmt.value, tint ? tint[3] : 0, 3, dt);
  });

  return (
    <group ref={group}>
      <points geometry={geo} material={mat} frustumCulled={false} />
      <ScannerRig group={group} />
    </group>
  );
}

/* ───────────────── Streams: transactions flying across the scene ───────────────── */

function Streams({ sprite, count }: { sprite: THREE.Texture; count: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);
  const seeds = useMemo(
    () => Array.from({ length: count }, () => ({ y: (Math.random() - 0.5) * 7, z: -2 - Math.random() * 6, sp: 0.4 + Math.random() * 1.2, off: Math.random() * 30 })),
    [count],
  );
  const mat = useRef<THREE.PointsMaterial>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = sceneStore.get();
    const v = Math.min(Math.abs(s.velocity), 60);
    const p = geo.attributes.position as THREE.BufferAttribute;
    seeds.forEach((sd, i) => {
      const x = (((t * sd.sp * (1 + v * 0.05) + sd.off) % 30) - 15);
      p.setXYZ(i, x, sd.y + Math.sin(t * 0.5 + sd.off) * 0.2, sd.z);
    });
    p.needsUpdate = true;
    if (mat.current) mat.current.opacity = 0.35 + Math.min(0.5, v * 0.02);
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial ref={mat} size={0.09} map={sprite} color={HOT} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Stars({ sprite, count }: { sprite: THREE.Texture; count: number }) {
  const geo = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 16;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph) - 6], i * 3);
      const c = Math.random() < 0.25 ? NEON : new THREE.Color("#f7f7f7");
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count]);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    const s = sceneStore.get();
    if (!ref.current) return;
    ref.current.rotation.y += dt * (0.006 + Math.min(Math.abs(s.velocity), 60) * 0.0009);
    ref.current.rotation.x = s.progress * 0.9;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.06} map={sprite} vertexColors transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function CameraRig() {
  const roll = useRef(0);
  useFrame(({ camera }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const s = sceneStore.get();
    camera.position.x = damp(camera.position.x, s.pointerX * 0.4, 2, dt);
    camera.position.y = damp(camera.position.y, -s.pointerY * 0.3, 2, dt);
    const z = s.shape === "tunnel" ? 6 : s.shape === "payxa" ? 8.2 : s.shape === "qr" ? 7.6 : 7.2;
    camera.position.z = damp(camera.position.z, z, 1.6, dt);
    camera.lookAt(0, 0, 0);
    // subtle cinematic roll with scroll velocity
    roll.current = damp(roll.current, Math.max(-0.05, Math.min(0.05, s.velocity * 0.0015)), 3, dt);
    camera.rotation.z += roll.current;
  });
  return null;
}

function World() {
  const sprite = useMemo(() => dotTexture(), []);
  const { viewport } = useThree();
  const mobile = viewport.aspect < 0.9;
  return (
    <>
      <CameraRig />
      <Stars sprite={sprite} count={mobile ? 450 : 900} />
      <Streams sprite={sprite} count={mobile ? 40 : 90} />
      <Particles count={mobile ? 2400 : 5200} />
    </>
  );
}

export default function Universe() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 7.2], fov: 42 }} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}>
        <World />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(1,1,1,0.55)_100%)]" />
    </div>
  );
}
