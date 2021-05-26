import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import { setError } from '../redux/actions/error';

const dropdownAnimation = {
  initial: { x: '-50%', y: -200 },
  visible: { x: '-50%', y: 75 },
  exit: { x: '-50%', y: -200 },
  transition: { delay: 0.3 }
};

const ErrorMsg = ({ error, setError }) => {

  setTimeout(() => setError(null), 6000);

  return (
    <motion.aside
      key="errormsg"
      variants={dropdownAnimation}
      initial="initial"
      exit="initial"
      animate="visible"
      className="error"
    >
      <p className="error__msg">{error}</p>
    </motion.aside>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: (msg) => dispatch(setError(msg))
});

export default connect(undefined, mapDispatchToProps)(ErrorMsg);
