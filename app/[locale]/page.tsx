"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "@/components/model"; // Model komponentini chaqiramiz
import { usePathname, useSearchParams } from "next/navigation";

export default function Home() {
  const params = useSearchParams();
  const pathname = usePathname();

  const url = params.get("url");

  if (url)
    return (
      <div className="h-full w-full">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Model url="https://f003.backblazeb2.com/file/bucket-kt-01/monk/scene.gltf" />{" "}
          <OrbitControls />
        </Canvas>
      </div>
    );
  return (
    <div className="flex h-full w-full items-center justify-center text-center">
      <h1 className="text-2xl font-bold">Iltimos urlni kiriting</h1>
      <p>misol uchun</p>
      <p>{pathname}?url=model url manzili</p>
    </div>
  );
}
