import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import type { ConstellationNode } from '@/types/constellation';

interface StarNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
}

export function StarNode({ node, isSelected, onSelect }: StarNodeProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!hovered || isSelected) {
      setShowTooltip(false);
      return;
    }

    setShowTooltip(true);
    const timeout = window.setTimeout(() => setShowTooltip(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [hovered, isSelected]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = node.position[1] + Math.sin(t * 1.5 + node.position[0]) * 0.08;
  });

  const scale = hovered || isSelected ? 1.45 : 1;

  return (
    <group ref={groupRef} position={node.position}>
      <mesh
        scale={scale}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.18, 28, 28]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered || isSelected ? 2.6 : 1.4}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      <mesh rotation-x={Math.PI / 2} scale={hovered || isSelected ? 1.4 : 1}>
        <torusGeometry args={[0.34, 0.025, 18, 64]} />
        <meshStandardMaterial
          color={node.accent}
          emissive={node.accent}
          emissiveIntensity={hovered || isSelected ? 2.2 : 1.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      <Html position={[0, 0.5, 0]} center distanceFactor={7} style={{ pointerEvents: 'none', opacity: showTooltip ? 1 : 0, transition: 'opacity 0.2s ease' }}>
        <div className="w-52 rounded-2xl border border-white/15 bg-slate-900/90 px-3 py-2 text-center shadow-[0_0_20px_rgba(251,191,36,0.2)]">
          <p className="text-[10px] uppercase tracking-[0.16em] text-amber-100">{node.title}</p>
          <p className="mt-1 whitespace-normal text-[10px] leading-relaxed text-slate-300">{node.description}</p>
        </div>
      </Html>
    </group>
  );
}
