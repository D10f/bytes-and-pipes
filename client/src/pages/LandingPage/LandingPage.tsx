import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import LandingHeader from './components/LandingHeader/LandingHeader';
import UploadForm from './components/UploadForm/UploadForm';

import './LandingPage.scss';

export enum FileUploadStepsEnum {
  SELECT_FILE,
  SELECT_PASSWORD,
  UPLOAD_FILE,
  DONE
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
}

const LandingPage = () => {

  const [ currentStep, setCurrentStep ] = useState(FileUploadStepsEnum.SELECT_FILE);

  const updateStep = (step: FileUploadStepsEnum) => setCurrentStep(step);

  return (
    <motion.section
      className="landing"
      variants={popAnimation}
      initial="initial"
      animate="visible"
      exit="initial"
    >
      <LandingHeader currentStep={currentStep} />
      <UploadForm currentStep={currentStep} updateStep={updateStep} />
    </motion.section>
  );
};

export default LandingPage;
