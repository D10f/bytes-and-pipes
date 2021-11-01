import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
// import { useAppDispatch } from '@hooks/app';
import { useDispatch } from 'react-redux';
import { setError } from '@redux/errors/actions';
import { motion, Variants } from 'framer-motion';
import FilePicker from '@components/FilePicker/FilePicker';
import FileInfo from '@components/FileInfo/FileInfo';
import PasswordOptions, { EncryptionStrategy } from '../PasswordOptions/PasswordOptions';
import ProgressOverlay from '../ProgressOverlay/ProgressOverlay';
import { FileUploadStepsEnum } from '@pages/LandingPage/LandingPage';

import { MAX_UPLOAD_FILE_SIZE } from '@utils/constants';

import './UploadForm.scss';

interface IUploadFormProps {
  currentStep: number;
  updateStep: (step: FileUploadStepsEnum) => void;
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

const UploadForm = ({ currentStep, updateStep }: IUploadFormProps) => {

  const dispatch = useDispatch();

  const [file, setFile] = useState<File | null>(null);
  const [dragged, setDragged] = useState(false);
  const [password, setPassword] = useState('');

  const handleFileChange = (file: File): undefined => {
    if (file.size > MAX_UPLOAD_FILE_SIZE) {
      dispatch(setError('File cannot be greater than 1GB'));
      return;
    }
    setFile(file);
    updateStep(FileUploadStepsEnum.SELECT_PASSWORD);
  };

  const handlePasswordChange = (strategy: EncryptionStrategy) => {
    if (strategy === EncryptionStrategy.PASSWORD_BASED && !password) {
      dispatch(setError('Password cannot be empty'));
      return;
    }
    updateStep(FileUploadStepsEnum.UPLOAD_FILE);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];

    if (file) {
      handleFileChange(file);
    }

    setDragged(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragged(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragged(false);
  };

  return (
    <motion.form
      className={dragged ? "upload-form upload-form--dragged" : "upload-form"}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      variants={popAnimation}
      initial="initial"
      animate="visible"
      exit="initial"
    >

      <FileInfo file={file} />

      {currentStep === FileUploadStepsEnum.SELECT_FILE && (
        <FilePicker file={file} handleFileChange={handleFileChange} />
      )}

      {currentStep === FileUploadStepsEnum.SELECT_PASSWORD && (
        <PasswordOptions password={password} setPassword={setPassword} next={handlePasswordChange} />
      )}

      {currentStep === FileUploadStepsEnum.UPLOAD_FILE && (
        <ProgressOverlay file={file!} password={password} />
      )}

    </motion.form>
  );
};

export default UploadForm;
