import { OnboardingProvider } from "./OnboardingProvider";
import { OnboardingWizard } from "./OnboardingWizard";

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingWizard />
    </OnboardingProvider>
  );
}
