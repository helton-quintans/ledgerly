import React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
	size?: number;
	color?: string;
	strokeWidth?: number;
};

export default function FlyIcon({ size = 32, color = "currentColor", strokeWidth = 3, ...props }: Props) {
	const w = size;
	const h = Math.round(size * 0.875);
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 48 42"
			width={w}
			height={h}
			fill="none"
			{...props}
		>
			<path
				d={`M24 8
		A16 16 0 0 1 6.143 33.071
		A16 16 0 0 1 41.857 33.071
		A16 16 0 0 1 24 8 Z`}
				stroke={color}
				strokeWidth={strokeWidth}
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}