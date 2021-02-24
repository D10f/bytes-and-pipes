import { motion } from 'framer-motion';
import data from '../data';

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

const Document = ({ location }) => {

  let text;

  switch (location.pathname) {
    case '/about':        text = data.about; break;
    case '/how-it-works': text = data.howItWorks; break;
    case '/privacy':      text = data.terms; break;
    case '/terms':        text = data.privacy; break;
  };

  return (
    <motion.article className="about" dangerouslySetInnerHTML={{ __html: text }}
      variants={pageVariant}
      initial='initial'
      animate='visible'
      exit='exit'
    ></motion.article>
  );
};

export default Document;
