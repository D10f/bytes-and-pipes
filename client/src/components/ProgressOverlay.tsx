import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import Button from './Button';

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

const ProgressOverlay = ({ progress, reset, action, url }) => {

  const percentage = `${Math.round(progress)}%`;

  return (
    <motion.div
      variants={overlay}
      initial="initial"
      exit="initial"
      animate="visible"
      className={ action === 'download' ? 'progress progress--download' : 'progress'}
    >
      { (!url && progress < 100) && (
        <h3>
          { action === 'download' && <span className="progress__subtitle">Prefetching files</span>}
          <span className="progress__title">{percentage}</span>
        </h3>
      )}
      { url && (
        <>
          <h3 className="progress__title">
            { action === 'upload' ? 'Upload Complete!' : 'Download Complete!' }
          </h3>
          { action === 'upload' && <Button text="Upload another file?" action={reset} /> }
        </>
      )}
    </motion.div>
  );
};

const mapStateToProps = state => ({
  url: state.url
});

export default connect(mapStateToProps)(ProgressOverlay);
