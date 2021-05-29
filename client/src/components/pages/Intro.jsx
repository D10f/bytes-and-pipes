import { motion } from 'framer-motion';
import UploadForm from '../UploadForm';

const steps = [
  'Select a file',
  'Choose an encryption strategy',
  'Share the URL'
];

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

const Intro = () => {

  const headline = 'Share Your Files In Privacy';

  return (
    <motion.section
      variants={pageVariant}
      initial="initial"
      animate="visible"
      exit="initial"
      className="intro"
    >
      <motion.header
        variants={pageVariant}
        initial="initial"
        animate="visible"
        exit="initial"
        className="intro__header"
      >
        <h2 className="intro__headline">{headline}</h2>
        <motion.p
          className="intro__step"
          initial={{ opacity: 0, x: -250 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
        1. Select a file of up to 1GB.
        </motion.p>

        <motion.p
          className="intro__step"
          initial={{ opacity: 0, x: -250 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
        2. Choose a <a href="http://localhost:3000/about#encryption-strategy" target="_blank">encryption strategy</a>.
        </motion.p>

        <motion.p
          className="intro__step"
          initial={{ opacity: 0, x: -250 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
        3. Share the url.
        </motion.p>

      </motion.header>

      <UploadForm />
    </motion.section>
  );
};

export default Intro;
