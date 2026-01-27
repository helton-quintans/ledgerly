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

	return (
		<svg
			width={s}
			height={h}
			viewBox={`0 0 ${s} ${h}`}
			fill={variant === "filled" ? fill : "none"}
			stroke={stroke || fill}
			strokeWidth={strokeWidth || 2}
			{...props}
		>
			<path d={d} />
			{showLabel && label && (
				<text
					x={s / 2}
					y={h / 2}
					textAnchor="middle"
					fill={labelFill || fill}
					fontSize={labelFontSize || 16}
					fontFamily={labelFontFamily || "inherit"}
					dominantBaseline="middle"
				>
					{label}
				</text>
			)}
		</svg>
	);
}