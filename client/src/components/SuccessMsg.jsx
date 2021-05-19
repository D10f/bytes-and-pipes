import { connect } from 'react-redux';
import { setUrl } from '../redux/actions/url';
import { motion } from 'framer-motion';

const dropdownAnimation = {
  initial: { x: '-50%', y: -200 },
  visible: { x: '-50%', y: 75 },
  exit: { x: '-50%', y: -200 },
  transition: { delay: 0.3 }
};

// This should be the link to be shared, not downloaded directly
// <a
//   className="success__msg"
//   href={msg}
//   download={msg}
// >{msg}
// </a>

const SuccessMsg = ({ msg, setUrl  }) => {
  return (
    <motion.aside
      key="successmsg"
      variants={dropdownAnimation}
      initial="initial"
      exit="initial"
      animate="visible"
      className="success"
    >
      <a
        className="success__msg"
        href={msg}
      >{msg}
      </a>
      <span
        className="success__close"
        onClick={() => setUrl('')}
      >&times;
      </span>
    </motion.aside>
  )
};

const mapDispatchToProps = (dispatch) => ({
  setUrl: (url) => dispatch(setUrl(url))
});

export default connect(undefined, mapDispatchToProps)(SuccessMsg);
