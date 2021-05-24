import { motion } from 'framer-motion';

const dropdownAnimation = {
  initial: { x: '-50%', y: -200 },
  visible: { x: '-50%', y: 75 },
  exit: { x: '-50%', y: -200 },
  transition: { delay: 0.3 }
};

const WarningMsg = ({ msg }) => {
  return (
    <motion.aside
      key="warningmsg"
      variants={dropdownAnimation}
      initial="initial"
      exit="initial"
      animate="visible"
      className="warning"
    >
      <p className="warning__msg">{msg}</p>
      <span className="warning__close">&times;</span>
    </motion.aside>
  )
};

export default WarningMsg
