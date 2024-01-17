import { ReactNode, RefAttributes } from 'react';
import { LinkProps } from 'react-router-dom';
type PnBreadcrumbProps = {
    goBackAction?: () => void;
    goBackLabel?: string;
    showBackAction?: boolean;
    linkProps?: LinkProps & RefAttributes<HTMLAnchorElement>;
    linkRoute: string;
    linkLabel: ReactNode;
    currentLocationLabel: string;
};
declare const PnBreadcrumb: ({ goBackAction, goBackLabel, showBackAction, linkProps, linkRoute, linkLabel, currentLocationLabel, }: PnBreadcrumbProps) => JSX.Element;
export default PnBreadcrumb;
