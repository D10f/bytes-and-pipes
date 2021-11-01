import React, { ReactChild } from 'react';
import { motion } from 'framer-motion';

import './InstructionStep.scss';

interface IProps {
  children: ReactChild | ReactChild[]
  step: number;
  animationDelay?: number;
  isComplete?: boolean;
}

// TODO: Add some visual clue when a particular step is complete
const InstructionStep = ({ children, step, isComplete, animationDelay = 0.3 }: IProps) => {

  const styles = `landing__step ${isComplete ? 'landing__step--complete' : ''}`;

  return (
    <motion.p
      className={styles}
      initial={{ opacity: 0, x: -250 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay * step }}
    >
      { children }
    </motion.p>
  );
};

export default InstructionStep;
