import React, { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
// import { useAppDispatch } from '@hooks/app';
import { useDispatch } from 'react-redux';
import { setError } from '@redux/errors/actions';
import { TOAST_MESSAGE_DURATION } from '@utils/constants';
import './Toast.scss';

const slideDownAnimation: Variants = {
  initial: {
    x: 0,
    y: 0,
    opacity: 0
  },
  animate: {
    x: 0,
    y: 150,
    opacity: 1
  }
};

const Toast = ({ message }: { message: string }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => dispatch(setError('')), TOAST_MESSAGE_DURATION);
  }, [message]);

  return (
    <motion.aside
      className="toast"
      variants={slideDownAnimation}
      initial="initial"
      animate="animate"
      exit="initial"
    >
      <p className="toast__message">{message}</p>
    </motion.aside>
  );
};

export default Toast;
