const Button = ({ text, action }) => (
  <button
    onClick={action}
    className="cta"
    type={action ? 'button' : 'submit'}
  >
  {text}
  </button>
);

export default Button;
