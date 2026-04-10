import { ContactState } from '../../../models/DigitalDomicileOnboarding';

type Props = {
  pec: ContactState<string | undefined>;
  email: ContactState<string | undefined>;
  showOptionalEmail: boolean;
  onPecChange: (value?: string) => void;
  onEmailChange: (value?: string) => void;
  onShowOptionalEmail: (show: boolean) => void;
};

const PecStep: React.FC<Props> = ({
  pec,
  email,
  showOptionalEmail,
  onPecChange,
  onEmailChange,
  onShowOptionalEmail,
}) => {
  if (pec) {
    console.log(pec);
  }
  if (email) {
    console.log(email);
  }
  if (showOptionalEmail) {
    console.log(showOptionalEmail);
  }
  if (onPecChange) {
    console.log(onPecChange);
  }
  if (onEmailChange) {
    console.log(onEmailChange);
  }
  if (onShowOptionalEmail) {
    console.log(onShowOptionalEmail);
  }
  return <></>;
};

export default PecStep;
