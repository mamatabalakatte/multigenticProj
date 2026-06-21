'use client';

import React, { useState } from 'react';
import { KnowledgeGraphData, KnowledgeNode } from '@/lib/agents/types';

interface KnowledgeGraphProps {
  data: KnowledgeGraphData;
}

export default function KnowledgeGraph({ data }: KnowledgeGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<KnowledgeNode | null>(null);

  const width = 360;
  const height = 280;

  // Static node layout coordinates within a 360x280 box
  const nodePositions: Record<string, { x: number; y: number }> = {
    company: { x: 180, y: 140 },      // Center
    ceo: { x: 180, y: 55 },          // Top
    supplier1: { x: 70, y: 90 },     // Top-Left
    peer1: { x: 75, y: 200 },       // Bottom-Left
    peer2: { x: 285, y: 200 },      // Bottom-Right
    risk1: { x: 290, y: 90 },       // Top-Right
    product1: { x: 180, y: 225 },    // Bottom
  };

  const getGroupColors = (group: string) => {
    switch (group) {
      case 'company':
        return { fill: 'rgba(0, 229, 255, 0.2)', stroke: 'var(--cyberspace-blue)', glow: 'rgba(0, 229, 255, 0.4)' };
      case 'executive':
        return { fill: 'rgba(0, 255, 102, 0.2)', stroke: 'var(--terminal-green)', glow: 'rgba(0, 255, 102, 0.4)' };
      case 'competitor':
        return { fill: 'rgba(255, 74, 74, 0.15)', stroke: 'var(--alert-red)', glow: 'rgba(255, 74, 74, 0.3)' };
      case 'supplier':
        return { fill: 'rgba(255, 179, 0, 0.15)', stroke: 'var(--gold)', glow: 'rgba(255, 179, 0, 0.3)' };
      case 'risk':
        return { fill: 'rgba(255, 74, 74, 0.2)', stroke: 'var(--alert-red)', glow: 'rgba(255, 74, 74, 0.5)' };
      case 'product':
      default:
        return { fill: 'rgba(0, 229, 255, 0.15)', stroke: 'var(--cyberspace-blue)', glow: 'rgba(0, 229, 255, 0.3)' };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chartWrapper}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-muted)" />
            </marker>
          </defs>

          {/* Draw link lines */}
          {data.links.map((link, idx) => {
            const sourcePos = nodePositions[link.source];
            const targetPos = nodePositions[link.target];

            if (!sourcePos || !targetPos) return null;

            const isHighlighted = hoveredNode && (hoveredNode.id === link.source || hoveredNode.id === link.target);

            return (
              <g key={`link-${idx}`}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={isHighlighted ? 'var(--cyberspace-blue)' : 'var(--border-solid)'}
                  strokeWidth={isHighlighted ? 1.5 : 1}
                  markerEnd="url(#arrow)"
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
                
                {/* Connection Label */}
                <text
                  x={(sourcePos.x + targetPos.x) / 2}
                  y={(sourcePos.y + targetPos.y) / 2 - 4}
                  fill="var(--text-muted)"
                  fontSize="7"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {link.relation.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Draw node circles */}
          {data.nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const colors = getGroupColors(node.group);
            const isHovered = hoveredNode?.id === node.id;
            const r = node.group === 'company' ? 18 : 12;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glowing Aura Ring */}
                <circle
                  r={r + (isHovered ? 6 : 4)}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth="0.5"
                  style={{
                    opacity: isHovered ? 0.8 : 0.2,
                    transition: 'all 0.25s ease',
                    filter: `drop-shadow(0 0 4px ${colors.stroke})`
                  }}
                />

                {/* Filled Center Circle */}
                <circle
                  r={r}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isHovered ? 2 : 1}
                  style={{ transition: 'stroke-width 0.2s' }}
                />

                {/* Text Label underneath */}
                <text
                  y={r + 12}
                  fill={isHovered ? 'var(--text-primary)' : 'var(--text-secondary)'}
                  fontSize="8"
                  fontWeight={node.group === 'company' ? 700 : 500}
                  fontFamily="var(--font-sans)"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Connection Detail Tooltip */}
      <div style={styles.detailBox}>
        {hoveredNode ? (
          <div>
            <div style={styles.detailHeader}>
              <span style={styles.detailGroup}>{hoveredNode.group.toUpperCase()}</span>
              <h4 style={styles.detailName}>{hoveredNode.label}</h4>
            </div>
            <p style={styles.detailText}>{hoveredNode.details}</p>
          </div>
        ) : (
          <div style={styles.detailPlaceholder}>
            Hover over any ecosystem node to audit relational connections.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    width: '100%',
  },
  chartWrapper: {
    display: 'flex',
    justifyContent: 'center',
    background: 'rgba(5, 7, 10, 0.4)',
    border: '1px solid var(--border-solid)',
    borderRadius: '6px',
    padding: '12px 0',
  },
  detailBox: {
    height: '65px',
    padding: '10px 14px',
    background: 'rgba(0, 229, 255, 0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '2px',
  },
  detailGroup: {
    fontSize: '8px',
    color: 'var(--cyberspace-blue)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
  },
  detailName: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  detailText: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    lineHeight: 1.3,
  },
  detailPlaceholder: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    textAlign: 'center' as const,
  }
};
