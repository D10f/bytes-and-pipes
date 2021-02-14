import { motion } from 'framer-motion';
import UploadForm from './UploadForm';
import Step from  './Step';

const steps = [
  'Select a file',
  'Choose a strong password',
  'Share the URL'
];

const Intro = ({ headline }) => (
  <section className="intro">
    <motion.header className="intro__header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2 }}
    >
      <h2 className="intro__headline">{headline}</h2>
      {
        steps.map((text, idx) => <Step key={idx} text={text} step={idx + 1} />)
      }
    </motion.header>

    <UploadForm />
  </section>
);

export default Intro;
