"use client";

import React from "react";

type ReuleauxTriangleProps = React.SVGProps<SVGSVGElement> & {
	radius?: number;
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	variant?: "filled" | "outline";
	arcRadius?: number;
	label?: string;
	labelFill?: string;
	labelFontSize?: number;
	labelFontFamily?: string;
	showLabel?: boolean;
};

export function ReuleauxTriangle({ radius = 48, fill = "currentColor", variant = "filled", stroke, strokeWidth, arcRadius, label, labelFill, labelFontSize, labelFontFamily, showLabel = true, ...props }: ReuleauxTriangleProps) {
	const s = radius;
  const h = (Math.sqrt(3) / 2) * s;
  const R = arcRadius ?? s;

  const A = { x: s / 2, y: 0 };
  const B = { x: 0, y: h };
  const C = { x: s, y: h };

  const sweepFlag = (from: { x: number; y: number }, to: { x: number; y: number }, center: { x: number; y: number }) => {
    const vA = { x: from.x - center.x, y: from.y - center.y };
    const vB = { x: to.x - center.x, y: to.y - center.y };
    const cross = vA.x * vB.y - vA.y * vB.x;
    return cross > 0 ? 1 : 0;
  };

  const arc1Sweep = sweepFlag(B, C, A);
  const arc2Sweep = sweepFlag(C, A, B);
  const arc3Sweep = sweepFlag(A, B, C);

  const d = `M ${B.x} ${B.y} A ${R} ${R} 0 0 ${arc1Sweep} ${C.x} ${C.y} A ${R} ${R} 0 0 ${arc2Sweep} ${A.x} ${A.y} A ${R} ${R} 0 0 ${arc3Sweep} ${B.x} ${B.y} Z`;

  const extend = Math.max(R - h, 0);
  const pad = Math.max(s * 0.04, extend * 0.6);
  const vbW = s + pad * 2;
  const vbH = h + pad * 2 + extend * 0.6;

  const isOutline = variant === "outline";
  const useStroke = stroke ?? (isOutline ? "currentColor" : undefined);
  const useStrokeWidth = strokeWidth ?? (isOutline ? Math.max(2, Math.round(s * 0.06)) : undefined);

  const labelText = label ?? undefined;
  const labelColor = labelFill ?? (isOutline ? useStroke ?? "currentColor" : "#fff");
  const fontSize = labelFontSize ?? Math.round(s * 0.6);
  const fontFamily = labelFontFamily ?? "'Brush Script MT', 'Segoe Script', 'Pacifico', cursive";
  const centerY = (h + Math.max(extend * 0.5, 0)) / 2;

  return (
    <svg viewBox={`${-pad} ${-pad} ${vbW} ${vbH}`} width={vbW} height={vbH} {...props}>
      <path d={d} fill={isOutline ? "none" : fill} stroke={useStroke} strokeWidth={useStrokeWidth} />
      {showLabel && labelText && (
        <text
          x={s / 2}
          y={centerY}
          fill={labelColor}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontStyle="normal"
          transform={`skewX(-6)`}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {labelText}
        </text>
      )}
    </svg>
  );
}