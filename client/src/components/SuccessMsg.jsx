import { useState } from 'react';
import { motion } from 'framer-motion';
import Clipboard from './icons/Clipboard';

const dropdownAnimation = {
  initial: { x: '-50%', y: -200 },
  visible: { x: '-50%', y: 75 },
  exit: { x: '-50%', y: -200 },
  transition: { delay: 0.3 }
};

const SuccessMsg = ({ msg }) => {

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.aside
      key="successmsg"
      variants={dropdownAnimation}
      initial="initial"
      exit="initial"
      animate="visible"
      className="success"
    >
      <p className="success__msg">{copied ? 'Copied!' : msg}</p>
      { !copied &&
        <button className="success__clipboard" onClick={copyToClipboard}>
          <Clipboard />
        </button>
      }
    </motion.aside>
  )
};

export default SuccessMsg;
