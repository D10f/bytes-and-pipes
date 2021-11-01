import React, { useState } from 'react';
import PasswordInput from '@components/PasswordInput/PasswordInput';
import Button from '@components/Button/Button';
import { FileUploadStepsEnum } from '@pages/LandingPage/LandingPage';

export enum EncryptionStrategy {
  PASSWORD_BASED = 'PASSWORD_BASED',
  RANDOMLY_GENERATED = 'RANDOMLY_GENERATED'
}

interface IPasswordOptionsProps {
  password: string;
  setPassword: (passwd: string) => void;
  next: (strat: EncryptionStrategy) => void;
}

const PasswordOptions = ({ password, setPassword, next }: IPasswordOptionsProps) => {

  const [ strategy, setStrategy ] = useState<EncryptionStrategy|null>(null);

  if (strategy) {
    return (
      <>
        { strategy === EncryptionStrategy.PASSWORD_BASED && (
          <PasswordInput password={password} setPassword={setPassword} />
        )}
        <div className="is-flex mt-1">
          <Button
            text="Back"
            variant="outline"
            onClick={() => setStrategy(null)}
          />
          <Button
            text="Upload"
            variant="primary"
            onClick={() => next(strategy)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <p className="is-centered">Choose an encryption strategy:</p>
      <div className="is-flex">
        <Button
          text="Randomly generated (recommended)"
          variant="outline"
          onClick={() => setStrategy(EncryptionStrategy.RANDOMLY_GENERATED)}
        />
        <Button
          text="Password-based"
          variant="outline"
          onClick={() => setStrategy(EncryptionStrategy.PASSWORD_BASED)}
        />
      </div>
    </>
  );
};

export default PasswordOptions
