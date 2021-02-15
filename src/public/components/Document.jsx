import { motion } from 'framer-motion';

const pageVariant = {
  initial: {
    x: '-100vw',
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: '100vw',
    opacity: 0
  }
};

/* The text prop is static markup specifically for this content's layout */

const Document = ({ text }) => (
  <motion.article className="about" dangerouslySetInnerHTML={{ __html: text }}
    variants={pageVariant}
    initial='initial'
    animate='visible'
    exit='exit'
  ></motion.article>
);

export default Document;
