import { motion } from 'framer-motion';

const overlay = {
  initial: {
    scale: 1.25,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  },
  transition: { duration: 1 }
};

const ProgressOverlay = ({ progress, reset, action }) => {

  const percentage = `${Math.round(progress)}%`;

  return (
    <motion.div
      variants={overlay}
      initial="initial"
      exit="initial"
      animate="visible"
      className={ action === 'download' ? 'progress progress--download' : 'progress'}
    >
      { progress < 100 && (
        <h3>
          { action === 'download' && <span className="progress__subtitle">Prefetching files</span>}
          <span className="progress__title">{percentage}</span>
        </h3>
      )}
      { action === 'upload' && progress >= 100 && (
        <h3>
          <span className="progress__title">Upload Complete!</span>
          <span className="progress__subtitle" onClick={reset}>Upload another file?</span>
        </h3>
      )}
    </motion.div>
  );
};

export default ProgressOverlay;
