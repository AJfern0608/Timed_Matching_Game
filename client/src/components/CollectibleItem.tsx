import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CollectibleItemProps {
  position: [number, number, number];
}

export default function CollectibleItem({ position }: CollectibleItemProps) {
  const gemRef = useRef<THREE.Mesh>(null);
  
  // Animate the collectible
  useFrame(({ clock }) => {
    if (!gemRef.current) return;
    
    // Rotate and hover animation
    gemRef.current.rotation.y += 0.01;
    
    // Floating up and down movement
    const hoverOffset = Math.sin(clock.getElapsedTime() * 2) * 0.1;
    gemRef.current.position.y = position[1] + hoverOffset;
  });
  
  return (
    <mesh 
      ref={gemRef}
      position={position}
      castShadow
    >
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial 
        color="#FFD700" 
        metalness={0.7}
        roughness={0.2}
        emissive="#FFCC00"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
