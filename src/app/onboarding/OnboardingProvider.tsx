"use client";
import React, { createContext, useContext, useState } from "react";

export type OnboardingData = {
  careerGoal?: string;
  financeGoal?: string;
  healthGoal?: string;
  preferredPillar?: string;
};

const OnboardingContext = createContext<{
  data: OnboardingData;
  setData: (data: Partial<OnboardingData>) => void;
}>({
  data: {},
  setData: () => {},
});

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<OnboardingData>({});

  const setData = (newData: Partial<OnboardingData>) => {
    setDataState((prev) => ({ ...prev, ...newData }));
  };

  return (
    <OnboardingContext.Provider value={{ data, setData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
