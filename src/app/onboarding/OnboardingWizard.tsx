
import Stepper, { Step } from "./components/Stepper";
import WelcomeStep from "./steps/WelcomeStep";
import PillarsStep from "./steps/PillarsStep";
import GoalsStep from "./steps/GoalsStep";
import PreferencesStep from "./steps/PreferencesStep";
import SummaryStep from "./steps/SummaryStep";

export function OnboardingWizard() {
  return (
    <Stepper initialStep={1}>
      <Step>
        <WelcomeStep />
      </Step>
      <Step>
        <PillarsStep />
      </Step>
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
