import React, { useEffect } from 'react';
// import { /* useDispatch, */ useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import { getSentNotifications } from '../redux/dashboard/actions';
// import NotificationsTable from '../components/NotificationsTable/NotificactionsTable';

import {
  Formik,
  Form,
  Field,
} from 'formik';


const FilterNotificationsTable = () => {
  // const dispatch = useDispatch();
  // const notifications = useSelector((state: RootState) => state.dashboardState.notifications);
  
  useEffect(() => {
   // dispatch(getSentNotifications({ startDate: '2022-01-01T00:00:00.000Z', endDate: '2022-12-31T00:00:00.000Z' }));
  }, []);

  const initialValues={1:Number, 2:Number, 3:Number};


  return (
    <React.Fragment>
       <Formik
         initialValues={initialValues}
         onSubmit={(values, actions) => {
           console.log({ values, actions });
           alert(JSON.stringify(values, null, 2));
           actions.setSubmitting(false);
         }}
       >
         <Form>
           <label htmlFor="firstName">First Name</label>
           <Field id="firstName" name="firstName" placeholder="First Name" />
           <button type="submit">Submit</button>
         </Form>
       </Formik> 
    </React.Fragment>
  );
};

export default FilterNotificationsTable;
