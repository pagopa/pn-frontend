import React from 'react';

export type PnWizardStepProps = {
  label?: React.ReactNode;
  children: React.ReactNode;
};

const PnWizardStep: React.FC<PnWizardStepProps> = ({ children }) => <>{children}</>;

export default PnWizardStep;
