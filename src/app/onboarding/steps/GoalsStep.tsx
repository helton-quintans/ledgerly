"use client";
import { useOnboarding } from "../OnboardingProvider";

export default function GoalsStep() {
  const { data, setData } = useOnboarding();

  return (
    <div>
      <h2>Quais seus objetivos?</h2>
      <label>
        Carreira:
        <input
          type="text"
          value={data.careerGoal || ""}
          onChange={(e) => setData({ careerGoal: e.target.value })}
          maxLength={400}
        />
      </label>
      <label>
        Finanças:
        <input
          type="text"
          value={data.financeGoal || ""}
          onChange={(e) => setData({ financeGoal: e.target.value })}
          maxLength={400}
        />
      </label>
      <label>
        Saúde & Bem-estar:
        <input
          type="text"
          value={data.healthGoal || ""}
          onChange={(e) => setData({ healthGoal: e.target.value })}
          maxLength={400}
        />
      </label>
    </div>
  );
}
