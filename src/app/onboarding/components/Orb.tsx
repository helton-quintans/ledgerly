import { Mesh, Program, Renderer, Triangle, Vec3 } from 'ogl';
import { useEffect, useRef } from 'react';

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
}

export default function Orb({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  backgroundColor = '#000000'
}: OrbProps) {
  const ctnDom = useRef<HTMLDivElement>(null);

  // ...existing code from doc...

  return <div ref={ctnDom} className="w-full h-full" />;
}
// ...existing code from doc...
