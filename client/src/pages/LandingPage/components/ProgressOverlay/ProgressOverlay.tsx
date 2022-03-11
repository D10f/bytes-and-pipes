import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@components/Button/Button';
import UrlInput from '@components/UrlInput/UrlInput';
import useUpload from '@hooks/useUpload';
import './ProgressOverlay.scss';

interface IProgressOverlayProps {
  file: File;
  password: string | null;
  resetForm: () => void;
}

const overlay = {
  initial: {
    scale: 1.5,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  }
};

const ProgressOverlay = ({ file, password, resetForm }: IProgressOverlayProps) => {

  const { progress, url, error } = useUpload(file, password);

  return (
    <motion.div
      className="progress"
      variants={overlay}
      initial="initial"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <h3 className="progress__title">
        {
          progress < 100
            ? `${progress}%`
            : 'Upload Succesful!'
        }
      </h3>

      {url && (
        <>
          <UrlInput url={url} />
          <Button
            text="Upload Another File"
            variant="primary"
            onClick={resetForm}
          />
        </>
      )}
    </motion.div>
  );
};

export default ProgressOverlay;
