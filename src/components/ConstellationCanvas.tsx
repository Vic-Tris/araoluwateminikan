import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect } from 'react';
import { PerspectiveCamera } from 'three';
import type { ConstellationNode } from '@/types/constellation';
import { ConstellationLines } from './ConstellationLines';
import { StarField } from './StarField';
import { StarNode } from './StarNode';
import { secretNode } from '@/data/constellation';

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera) || size.width === 0 || size.height === 0) return;

    const aspectRatio = size.width / size.height;
    camera.position.set(0, 0, Math.max(9, 8.3 / aspectRatio));
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  return null;
}

interface ConstellationCanvasProps {
  nodes: ConstellationNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  secretUnlocked: boolean;
}

export function ConstellationCanvas({
  nodes,
  selectedNodeId,
  onSelectNode,
  secretUnlocked,
}: ConstellationCanvasProps) {
  const visibleNodes = [...nodes, secretNode];

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 9], fov: 48 }} dpr={[1, 2]}>
        <ResponsiveCamera />
        <color attach="background" args={['#050912']} />
        <fog attach="fog" args={['#050912', 8, 21]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[0, 2, 5]} intensity={24} color="#f8d8a5" />
        <pointLight position={[0, -2, -4]} intensity={18} color="#7ea7ff" />
        <StarField />
        <ConstellationLines
          nodes={visibleNodes}
          selectedNodeId={selectedNodeId}
          showSecretNode
          secretUnlocked={secretUnlocked}
        />

        {visibleNodes.map((node) => (
          <StarNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={onSelectNode}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={6}
          maxDistance={13}
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
