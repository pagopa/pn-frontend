import { Fragment } from 'react';

type Props = {
  children: JSX.Element;
};
const NotificationDetailTableAction: React.FC<Props> = ({ children }) => (
  <Fragment>{children}</Fragment>
);

export default NotificationDetailTableAction;
