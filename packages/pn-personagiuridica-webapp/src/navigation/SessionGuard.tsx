import { Outlet } from "react-router-dom";

// TODO: evaluate if took SessionGuard from pf and pa, create a common component and put it in pn-commons
const SessionGuard = () => <Outlet />;

export default SessionGuard;
