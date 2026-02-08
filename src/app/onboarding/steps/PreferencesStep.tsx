"use client";
import { useOnboarding } from "../OnboardingProvider";

export default function PreferencesStep() {
  const { data, setData } = useOnboarding();

  return (
    <div>
      <h2>Qual pilar você quer focar primeiro?</h2>
      <select
        value={data.preferredPillar || ""}
        onChange={e => setData({ preferredPillar: e.target.value })}
      >
        <option value="">Selecione...</option>
        <option value="career">Carreira</option>
        <option value="finance">Finanças</option>
        <option value="health">Saúde & Bem-estar</option>
      </select>
    </div>
  );
}
