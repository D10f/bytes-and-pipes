import { useState } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import { setError } from '../../redux/actions/error';
import PasswordInput from '../PasswordInput';

const actionsEnum = {
  login: 'Login',
  signup: 'Signup'
};

const pageVariant = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  }
};

const Login = ({ setError }) => {

  const { login, signup } = actionsEnum;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState(login);

  // Toggle between login and signup
  const handleClick = (e) => {
    switch (action) {
      case login:  setAction(signup); break;
      case signup: setAction(login); break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError('Please fill both email and password fields');
    }

    let url = '';

    if (action === login) {
      url = 'localhost:3000/login';
    } else {
      url = 'localhost:3000/signup';
    }

    setError(`Cannot reach ${url}`);
  };

  return (
    <motion.article
      variants={pageVariant}
      initial="initial"
      animate="visible"
      exit="initial"
      className="login"
    >
      <form
        className="login__form"
        onSubmit={handleSubmit}
      >
        <div className="login__control-group">
          <input
            onChange={e => setEmail(e.target.value)}
            className="login__input"
            placeholder="Email Address"
            value={email}
            name="email"
            id="email"
          />
        </div>

        <PasswordInput
          password={password}
          setPassword={setPassword}
          passwordSuggestions={action === signup}
        />

        <button className="login__btn">
          {action}
        </button>

        <footer className="login__footer" onClick={handleClick}>
          { action === login
            ? "Don't have an account? Signup"
            : "Already have an account? Login"
          }
        </footer>
      </form>
    </motion.article>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: (msg) => dispatch(setError(msg))
});

export default connect(undefined, mapDispatchToProps)(Login);
