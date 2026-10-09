import { Line } from '@react-three/drei';
import type { ConstellationNode } from '@/types/constellation';

const nodeConnections = [
  ['memory-1', 'memory-2'],
  ['memory-2', 'memory-3'],
  ['memory-3', 'memory-4'],
  ['memory-4', 'memory-5'],
] as const;

interface ConstellationLinesProps {
  nodes: ConstellationNode[];
  selectedNodeId: string | null;
  showSecretNode: boolean;
  secretUnlocked: boolean;
}

export function ConstellationLines({
  nodes,
  selectedNodeId,
  showSecretNode,
  secretUnlocked,
}: ConstellationLinesProps) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return (
    <group>
      {nodeConnections.map(([fromId, toId]) => {
        const from = nodeMap.get(fromId);
        const to = nodeMap.get(toId);
        if (!from || !to) return null;

        const selected = selectedNodeId === fromId || selectedNodeId === toId;

        return (
          <Line
            key={`${fromId}-${toId}`}
            points={[from.position, to.position]}
            color={selected ? '#f7d89f' : '#8aa7d3'}
            transparent
            opacity={selected ? 0.9 : 0.38}
            lineWidth={1.2}
          />
        );
      })}

      {showSecretNode && !secretUnlocked && (
        <Line
          points={[[3.2, 0.8, 0.6], [0, -2.4, -0.5]]}
          color="#f9dac2"
          transparent
          opacity={0.22}
          lineWidth={0.9}
        />
      )}
    </group>
  );
}
