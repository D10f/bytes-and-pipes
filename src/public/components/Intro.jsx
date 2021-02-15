import { motion } from 'framer-motion';
import UploadForm from './UploadForm';
import Step from  './Step';

const steps = [
  'Select a file',
  'Choose a strong password',
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

const introVariant = {
  initial: {
    y: -100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.6
    }
  }
};

const Intro = () => {

  const headline = 'Share Your Files In Privacy';

  return (
    <section className="intro">
      <motion.header className="intro__header"
        variants={pageVariant}
        initial='initial'
        animate='visible'
      >
        <h2 className="intro__headline">{headline}</h2>
        {
          steps.map((text, idx) => <Step key={idx} text={text} step={idx + 1} />)
        }
      </motion.header>

      <UploadForm />
    </section>
  );
};

export default Intro;
