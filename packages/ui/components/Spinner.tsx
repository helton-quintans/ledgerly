"use client";

import { CSSProperties } from "react";
import ReuleauxTriangle from "./ReuleauxTriangle";

type SpinnerProps = {
	size?: number;
	color?: string;
	speed?: number; 
	triangleScale?: number; 
};

export default function Spinner({ size = 40, color = "currentColor", speed = 1, triangleScale = 0.8 }: SpinnerProps) {
	const triangleSize = Math.max(8, Math.round(size * Math.min(Math.max(triangleScale, 0.1), 1)));

	const containerStyle: CSSProperties = {
		width: size,
		height: size,
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
	};

	const triangleWrapperStyle: CSSProperties = {
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		animation: `spin ${speed}s linear infinite`,
		transformOrigin: "50% 50%",
	};

	return (
		<div style={containerStyle}>
			<style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
			<div style={triangleWrapperStyle} aria-hidden>
				<ReuleauxTriangle radius={triangleSize} variant="outline" stroke={color} showLabel={false} width={triangleSize} height={triangleSize} />
			</div>
		</div>
	);
}
