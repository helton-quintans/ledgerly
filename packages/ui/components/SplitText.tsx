"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
  stagger?: number;
  trigger?: 'immediate' | 'scroll';
  style?: React.CSSProperties;
};

export function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 1,
  ease = 'power2.out',
  splitType = 'chars',
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '0px',
  textAlign = 'left',
  onLetterAnimationComplete,
  showCallback = false,
  stagger = 0.05,
  trigger = 'scroll',
  style
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Split text into elements based on splitType
  const splitTextIntoElements = () => {
    switch (splitType) {
      case 'words':
        return text.split(' ').map((word, index) => (
          <span key={index} className="inline-block mr-[0.25em]" data-split-element>
            {word}
          </span>
        ));
      
      case 'lines':
        return text.split('\n').map((line, index) => (
          <span key={index} className="block" data-split-element>
            {line}
          </span>
        ));
      
      case 'chars':
      default:
        return text.split('').map((char, index) => (
          <span key={index} className="inline-block" data-split-element>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ));
    }
  };

  // Animation function
  const animateElements = () => {
    if (!containerRef.current || hasAnimated) return;

    const elements = containerRef.current.querySelectorAll('[data-split-element]');
    if (elements.length === 0) return;

    // Set initial state
    gsap.set(elements, from);

    // Create timeline
    tlRef.current = gsap.timeline({
      delay: delay / 1000, // Convert ms to seconds
      onComplete: () => {
        setHasAnimated(true);
        if (onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
        if (showCallback) {
          console.log('Animation complete!');
        }
      }
    });

    // Animate elements
    tlRef.current.to(elements, {
      ...to,
      duration: duration,
      ease: ease,
      stagger: stagger
    });
  };

  // Intersection Observer setup
  useEffect(() => {
    if (trigger === 'immediate') {
      setIsInView(true);
      return;
    }

    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasAnimated, trigger]);

  // Trigger animation when in view
  useEffect(() => {
    if (isInView && !hasAnimated) {
      // Small delay to ensure elements are rendered
      const timeoutId = setTimeout(animateElements, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, hasAnimated]);

  // Cleanup
  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div
      ref={containerRef}
      className={`${className} ${alignmentClasses[textAlign]} overflow-hidden`}
      style={style}
    >
      {splitTextIntoElements()}
    </div>
  );
}