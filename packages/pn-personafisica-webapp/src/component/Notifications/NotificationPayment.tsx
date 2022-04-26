import { Paper } from "@mui/material";
import { NotificationDetail } from "@pagopa-pn/pn-commons";
import { useEffect, useState } from "react";
import NotificationPaymentDetail, { PaymentDetail, PaymentStatus } from "./NotificationPaymentDetail";

interface Props {
  notification: NotificationDetail;
}

const dummyDetail: PaymentDetail = {
  amount: 47350,
  status: PaymentStatus.FAILED
};

const NotificationPayment: React.FC<Props> = () => {
// const NotificationPayment: React.FC<Props> = ({notification}) => {
  const [paymentDetail, setPaymentDetail] = useState< PaymentDetail | null >(null);

  useEffect(() => {
    setTimeout(() => {
      setPaymentDetail(dummyDetail);
    }, 5000);
  }, []);

  return (
    <Paper sx={{ padding: '1rem', marginBottom: '1rem' }} className="paperContainer">
        <NotificationPaymentDetail paymentDetail={paymentDetail} />
    </Paper>
    
  );
};

export default NotificationPayment;