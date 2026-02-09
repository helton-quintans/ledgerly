"use client";
import { useState } from "react";
import { FlowingMenu } from "@ledgerly/ui/components/FlowingMenu";
import { ColorBends } from "@ledgerly/ui";
import Stepper, { Step } from "./components/Stepper";
import GoalsStep from "./steps/GoalsStep";
import PreferencesStep from "./steps/PreferencesStep";
import SummaryStep from "./steps/SummaryStep";

const pillars = [
  {
    link: "#career",
    text: "Career",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
  },
  {
    link: "#finance",
    text: "Finance",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80"
  },
  {
    link: "#health",
    text: "Health & Well-being",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"    
  }
];

export function OnboardingWizard() {
  const [pillarSelected, setPillarSelected] = useState<null | (typeof pillars[0] & { confirmed?: boolean })>(null);

  if (!pillarSelected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ColorBends
            colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
            rotation={0}
            speed={0.3}
            scale={0.8}
            frequency={1.2}
            warpStrength={1.2}
            mouseInfluence={0.8}
            parallax={0.5}
            noise={0.1}
            transparent={false}
            autoRotate={0.15}
            className="pointer-events-auto"
          />
        </div>
        <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-10 py-16 px-4 relative z-10">
          <div className="text-center mb-8">
            <div>
              <h2 className="inline-block p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-lg transition-all animate-fade-in text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
                Welcome to Ledgerly!
              </h2>
              <p className="rounded-2xl p-2 bg-black/60 backdrop-blur-md border border-white/20 text-lg md:text-2xl text-white/80 font-medium">
                simplify and hack your life.
              </p>
            </div>
          </div>
          <div className="w-full h-[40vh] flex items-center justify-center py-3 bg-[#0a0a0a]/50 rounded-2xl border border-[#222] animate-fade-in delay-200">
            <FlowingMenu
              items={pillars.map(pillar => ({
                ...pillar,
                onClick: () => setPillarSelected(pillar)
              }))}
              speed={15}
              textColor="#fff"
              bgColor="#0a0a0a"
              marqueeBgColor="#fff"
              marqueeTextColor="#0a0a0a"
              borderColor="#fff"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Stepper initialStep={1}>
      <Step>
        <GoalsStep />
      </Step>
      <Step>
        <PreferencesStep />
      </Step>
      <Step>
        <SummaryStep />
      </Step>
    </Stepper>
  );
}
