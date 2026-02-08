"use client";
import { useOnboarding } from "../OnboardingProvider";

export default function SummaryStep() {
  const { data } = useOnboarding();

  return (
    <div>
      <h2>Resumo do seu onboarding</h2>
      <ul>
        <li><strong>Carreira:</strong> {data.careerGoal}</li>
        <li><strong>Finanças:</strong> {data.financeGoal}</li>
        <li><strong>Saúde & Bem-estar:</strong> {data.healthGoal}</li>
        <li><strong>Pilar preferido:</strong> {data.preferredPillar}</li>
      </ul>
      <button type="button">Começar!</button>
    </div>
  );
}
