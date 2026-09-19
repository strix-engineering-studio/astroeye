"use client";

import React, { Suspense, useRef } from "react";
import type { Mesh } from "three";
import { Canvas, useFrame } from "@react-three/fiber";

function FloatingTorus() {
  const ref = useRef<Mesh | null>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 4) * 0.1;
      ref.current.position.y = Math.sin(state.clock.elapsedTime / 2) * 0.15;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.6, 0]} castShadow>
      <torusGeometry args={[0.8, 0.18, 32, 64]} />
      <meshStandardMaterial color="#7ee787" metalness={0.6} roughness={0.2} />
    </mesh>
  );
}

function GridFloor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#020417" metalness={0.2} roughness={0.9} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded min-h-52 sm:min-h-60 lg:min-h-64">
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 3], fov: 50 }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <FloatingTorus />
          <GridFloor />
        </Suspense>
      </Canvas>
    </div>
  );
}
