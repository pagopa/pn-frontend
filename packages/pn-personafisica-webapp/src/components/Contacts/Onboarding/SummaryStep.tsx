import { WizardMode } from '../../../models/DigitalDomicileOnboarding';
import { IOAllowedValues } from '../../../models/contacts';

type Props = {
  mode: WizardMode;
  email?: string;
  pec?: string;
  io?: IOAllowedValues;
  disclaimerAccepted: boolean;
  onDisclaimerChange: (accepted: boolean) => void;
};

const SummaryStep: React.FC<Props> = ({
  mode,
  email,
  pec,
  io,
  disclaimerAccepted,
  onDisclaimerChange,
}) => {
  if (mode) {
    console.log(mode);
  }
  if (email) {
    console.log(email);
  }
  if (pec) {
    console.log(pec);
  }
  if (io) {
    console.log(io);
  }
  if (disclaimerAccepted) {
    console.log(disclaimerAccepted);
  }
  if (onDisclaimerChange) {
    console.log(onDisclaimerChange);
  }
  return <></>;
};

export default SummaryStep;
