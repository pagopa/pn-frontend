import { useParams} from 'react-router-dom';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { useAppDispatch } from '../redux/hooks';
import { getReceivedNotification } from '../redux/notification/actions';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

const NotificationDetail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      void dispatch(getReceivedNotification(id));
    }
  }, []);

  return (
    <Box className={classes.root}>
      <h4>Navigation OK</h4>
    </Box>
  );
};

export default NotificationDetail;
