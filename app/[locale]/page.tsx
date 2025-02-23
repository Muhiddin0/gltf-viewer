"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "@/components/model"; // Model komponentini chaqiramiz

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model url="/models/monk/scene.gltf" /> {/* Modelni chaqirish */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
