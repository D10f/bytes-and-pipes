import React from 'react';
import { motion, Variants } from 'framer-motion';
import InstructionStep from '../InstructionStep/InstructionStep';
import { FileUploadStepsEnum } from '@pages/LandingPage/LandingPage';
import { LANDING_HEADLINE, DEV_URL } from '@utils/constants';

import './LandingHeader.scss';

interface ILandingHeaderProps {
  currentStep: number;
}

const popAnimation: Variants = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  }
};

const LandingHeader = ({ currentStep }: ILandingHeaderProps) => (
  <motion.header
    variants={popAnimation}
    initial="initial"
    animate="visible"
    exit="initial"
    className="landing__header"
  >

    <h2 className="landing__headline">{LANDING_HEADLINE}</h2>

    <InstructionStep
      step={1}
      isComplete={currentStep > FileUploadStepsEnum.SELECT_FILE}
    >
      1. Select or drop a file of up to 1GB.
    </InstructionStep>

    <InstructionStep
      step={2}
      isComplete={currentStep > FileUploadStepsEnum.SELECT_PASSWORD}
    >
      2. Choose an <a href={`${DEV_URL}/about#encryption-strategy`} target="_blank">encryption strategy</a>.
    </InstructionStep>

    <InstructionStep
      step={3}
      isComplete={currentStep > FileUploadStepsEnum.UPLOAD_FILE}
    >
      3. Share the url.
    </InstructionStep>

  </motion.header>
);

export default LandingHeader;
