import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

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
      <p className="success__container">
        <span className="success__msg">{msg}</span>
      </p>
      <Button classes="flex-stretch" text={copied ? "Copied!" : "Copy Link"} action={copyToClipboard} />
    </motion.aside>
  )
};

export default SuccessMsg;
