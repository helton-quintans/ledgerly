"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export type FlowingMenuProps = {
  items: Array<{
    link: string;
    text: string;
    image: string;
  }>;
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function FlowingMenu({
  items,
  speed = 15,
  textColor = "#ffffff",
  bgColor = "#060010",
  marqueeBgColor = "#ffffff", 
  marqueeTextColor = "#060010",
  borderColor = "#ffffff",
  className,
  style
}: FlowingMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || !marqueeRef.current) return;

    // Create infinite scrolling marquee
    const marqueeItems = marqueeRef.current.children;
    if (marqueeItems.length === 0) return;

    // Clone items for seamless loop
    const firstItem = marqueeItems[0] as HTMLElement;
    const itemWidth = firstItem.offsetWidth;
    const totalWidth = itemWidth * items.length;

    // Set up animation
    tlRef.current = gsap.timeline({ repeat: -1 });
    tlRef.current.to(marqueeRef.current, {
      x: -totalWidth,
      duration: totalWidth / speed,
      ease: "none"
    });

    return () => {
      tlRef.current?.kill();
    };
  }, [items, speed]);

  const handleItemHover = (item: typeof items[0], event: React.MouseEvent) => {
    if (!imageRef.current) return;

    // Update background image
    imageRef.current.src = item.image;
    imageRef.current.style.opacity = '1';

    // Position image near cursor
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      gsap.to(imageRef.current, {
        x: x - 150, // Offset to center image
        y: y - 100,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleItemLeave = () => {
    if (!imageRef.current) return;
    
    gsap.to(imageRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ 
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        ...style 
      }}
    >
      {/* Background Image */}
      <img
        ref={imageRef}
        className="absolute pointer-events-none z-10 w-[300px] h-[200px] object-cover rounded-lg shadow-xl opacity-0"
        alt="Preview"
        style={{
          filter: 'brightness(0.8) contrast(1.1)',
        }}
      />

      {/* Flowing Menu */}
      <div className="relative z-20 h-full flex items-center">
        <div 
          ref={marqueeRef}
          className="flex whitespace-nowrap"
          style={{ 
            backgroundColor: marqueeBgColor,
            color: marqueeTextColor,
          }}
        >
          {/* Render items twice for seamless loop */}
          {[...items, ...items].map((item, index) => (
            <a
              key={`${item.text}-${index}`}
              href={item.link}
              className="inline-block px-8 py-4 text-4xl font-bold transition-all duration-300 hover:scale-110 hover:text-opacity-80"
              style={{ color: marqueeTextColor }}
              onMouseEnter={(e) => handleItemHover(item, e)}
              onMouseMove={(e) => handleItemHover(item, e)}
              onMouseLeave={handleItemLeave}
            >
              {item.text}
            </a>
          ))}
        </div>
      </div>

      {/* Overlay effects */}
      <div 
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: `linear-gradient(90deg, ${bgColor} 0%, transparent 20%, transparent 80%, ${bgColor} 100%)`,
        }}
      />
    </div>
  );
}