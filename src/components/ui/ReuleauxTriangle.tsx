"use client";

import React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  variant?: "filled" | "outline";
  arcRadius?: number;
};

// Reuleaux triangle constructed from three circular arcs.
export default function ReuleauxTriangle({ radius = 48, fill = "currentColor", variant = "filled", stroke, strokeWidth, arcRadius, ...props }: Props) {
  // Here `radius` is interpreted as the side length of the equilateral triangle
  const s = radius;
  const h = (Math.sqrt(3) / 2) * s;
  // arc radius controlling bulge; default is the side length (true Reuleaux)
  const R = arcRadius ?? s;

  // We'll position the top vertex at (s/2, 0) and base vertices below
  const A = { x: s / 2, y: 0 };
  const B = { x: 0, y: h };
  const C = { x: s, y: h };
  // Helper to compute sweep flag so arcs bulge outward
  const sweepFlag = (from: { x: number; y: number }, to: { x: number; y: number }, center: { x: number; y: number }) => {
    const vA = { x: from.x - center.x, y: from.y - center.y };
    const vB = { x: to.x - center.x, y: to.y - center.y };
    const cross = vA.x * vB.y - vA.y * vB.x;
    return cross > 0 ? 1 : 0;
  };

  // Build path using arcs of radius = side length, centered at the opposite vertex
  // Each arc goes from one vertex to the next and should bulge outward (minor arc)
  const arc1Sweep = sweepFlag(B, C, A); // arc from B->C centered at A
  const arc2Sweep = sweepFlag(C, A, B); // arc from C->A centered at B
  const arc3Sweep = sweepFlag(A, B, C); // arc from A->B centered at C

  const d = `M ${B.x} ${B.y} A ${R} ${R} 0 0 ${arc1Sweep} ${C.x} ${C.y} A ${R} ${R} 0 0 ${arc2Sweep} ${A.x} ${A.y} A ${R} ${R} 0 0 ${arc3Sweep} ${B.x} ${B.y} Z`;

  // padding: arcs extend beyond triangle bounding box roughly by (R - h)
  const extend = Math.max(R - h, 0); // how far arcs bulge past base height
  const pad = Math.max(s * 0.04, extend * 0.6);
  const vbW = s + pad * 2;
  const vbH = h + pad * 2 + extend * 0.6;

  const isOutline = variant === "outline";
  const useStroke = stroke ?? (isOutline ? "currentColor" : undefined);
  const useStrokeWidth = strokeWidth ?? (isOutline ? Math.max(2, Math.round(s * 0.06)) : undefined);

  return (
    <svg viewBox={`${-pad} ${-pad} ${vbW} ${vbH}`} width={vbW} height={vbH} {...props}>
      <path d={d} fill={isOutline ? "none" : fill} stroke={useStroke} strokeWidth={useStrokeWidth} />
    </svg>
  );
}
