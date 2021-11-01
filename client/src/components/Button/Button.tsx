import React, { FunctionComponent } from 'react';
import './Button.scss';

// enum ButtonVariants {
//   primary,
//   outline
// }

type ButtonTypes = 'button' | 'submit' | 'reset' | undefined;
type ButtonVariants = 'primary' | 'outline';

interface IButtonProps {
  text: string;
  variant?: ButtonVariants;
  btnType?: ButtonTypes;
  onClick?: () => void;
}

const Button = ({ text, variant, btnType, onClick }: IButtonProps) => {

  const styles = variant ? `btn--${variant}` : 'btn';
  const action = btnType || 'button';

  return (
    <button
      className={styles}
      type={action}
      onClick={onClick}
    >
      { text }
    </button>
  );
};

export default Button;
