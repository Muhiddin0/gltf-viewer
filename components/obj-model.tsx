// @ts-nocheck

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface ModelViewerProps {
  objUrl: string;
  mtlUrl?: string;
  width?: number;
  height?: number;
  scale?: number;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  objUrl,
  mtlUrl,
  width = 500,
  height = 500,
  scale = 1,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Sahna, kamera va renderer yaratish
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Alpha yoqiladi, shaffof fon uchun
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Orqa fonni shaffof qilish (alpha = 0)
    mountRef.current.appendChild(renderer.domElement);

    // Yorug‘lik qo‘shish
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // OBJ va MTL yuklash
    const objLoader = new OBJLoader();

    const loadModel = () => {
      objLoader.load(
        objUrl,
        (object: THREE.Object3D) => {
          modelRef.current = object;
          scene.add(object);

          // Modelni markazlashtirish va o‘lchamini moslashtirish
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          object.position.sub(center);
          const baseScale = 5 / Math.max(size.x, size.y, size.z);
          object.scale.set(
            baseScale * scale,
            baseScale * scale,
            baseScale * scale,
          );
        },
        (xhr: ProgressEvent) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% OBJ yuklandi");
        },
        (error: ErrorEvent) => {
          console.error("OBJ faylni yuklashda xatolik:", error);
        },
      );
    };

    if (mtlUrl) {
      const mtlLoader = new MTLLoader();
      mtlLoader.load(
        mtlUrl,
        // @ts-ignore
        (materials) => {
          materials.preload();
          objLoader.setMaterials(materials);
          loadModel();
        },
        (xhr: ProgressEvent) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% MTL yuklandi");
        },
        (error: ErrorEvent) => {
          console.error("MTL faylni yuklashda xatolik:", error);
          loadModel();
        },
      );
    } else {
      loadModel();
    }

    // Kamera pozitsiyasi
    camera.position.z = 5;

    // OrbitControls qo‘shish
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    // Avtomatik aylanishni boshqarish uchun flag
    let isAutoRotating = true;

    // OrbitControls ishlatilayotganda aylanishni to‘xtatish
    controls.addEventListener("start", () => {
      isAutoRotating = false;
    });
    controls.addEventListener("end", () => {
      isAutoRotating = true;
    });

    // Animatsiya funksiyasi
    const animate = () => {
      if (modelRef.current && isAutoRotating) {
        modelRef.current.rotation.y += 0.01;
      }

      controls.update();
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);

    // Tozalash
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      controls.dispose();
      scene.clear();
      renderer.dispose();
    };
  }, [objUrl, mtlUrl, width, height, scale]);

  return <div ref={mountRef} style={{ width, height }} />;
};
