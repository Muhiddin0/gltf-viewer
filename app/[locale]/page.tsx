"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "@/components/gltf-model"; // Model komponentini chaqiramiz
import { useSearchParams } from "next/navigation";
import { ModelViewer } from "@/components/obj-model";

export default function Home() {
  const params = useSearchParams();

  const model = params.get("model");
  const mtl = params.get("mtl");
  const scale = params.get("scale");
  const width = params.get("width");
  const height = params.get("height");

  if (model)
    return (
      <div className="flex h-full min-h-screen w-full items-center justify-center">
        {model.endsWith(".gltf") ? (
          <Canvas
            style={{
              width: "100vw",
              height: "100vh",
              backgroundColor: "transparent !important",
            }}
            camera={{ position: [0, 2, 5], fov: 50 }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Model url={model} scale={scale ? Number(scale) : 1} />{" "}
            <OrbitControls />
          </Canvas>
        ) : (
          <ModelViewer
            objUrl={model}
            mtlUrl={mtl || undefined}
            scale={scale ? Number(scale) : 1}
            height={height ? Number(height) : 500}
            width={width ? Number(width) : 500}
          />
        )}
      </div>
    );
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
      <h1>Options:</h1>
      <ol className="text w-[250px] list-disc *:text-slate-600">
        <li className="font-bold !text-white">model</li>
        <li>mtl</li>
        <li>scale</li>
        <li>width</li>
        <li>height</li>
      </ol>
    </div>
  );
}
