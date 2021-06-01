const Button = ({ classes, text, action }) => (
  <button
    onClick={action}
    className={`cta ${classes}`}
    type={action ? 'button' : 'submit'}
  >
  {text}
  </button>
);

export default Button;
