import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";

interface ModelProps {
  url: string;
}

export function Model({ url }: ModelProps) {
  const modelRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, modelRef);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]);

  // Tugmani bosganda aylanishni to‘xtatish
  const handlePointerDown = () => {
    setIsRotating(false);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Qo‘yib yuborganda qayta aylantirish
  const handlePointerUp = () => {
    setIsRotating(true);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  useFrame(() => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1}
      onPointerDown={handlePointerDown} // Bosganda to‘xtaydi
    />
  );
}
