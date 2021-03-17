import { motion } from 'framer-motion';

const Step = ({ text, step }) => (
  <motion.p className="intro__step"
    initial={{ opacity: 0, x: -250 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 * step }}
  >
  {step}. {text}
  </motion.p>
);

export default Step;
