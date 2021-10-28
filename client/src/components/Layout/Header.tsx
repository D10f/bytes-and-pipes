import { connect } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ErrorMsg from '@components/ErrorMsg';
import SuccessMsg from '@components/SuccessMsg';

const dropdownAnimation = {
  initial: { y: -200 },
  visible: { y: 0 },
  exit: { y: -200 },
  transition: { delay: 0.2 }
};

const Header = ({ error, url }) => {

  const title = 'Bytes And Pipes';

  return (
    <motion.header className="header"
      variants={dropdownAnimation}
      initial="initial"
      animate="visible"
      exit="initial"
    >
      <AnimatePresence>
        { error && (
          <ErrorMsg error={error} />
        )}
        { url && (
          <SuccessMsg msg={url} />
        )}
      </AnimatePresence>
      <Link to="/">
        <motion.h1 className="header__logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1.1 }}
          transition={{ delay: 0.6 }}
        >
          {title}
        </motion.h1>
      </Link>
    </motion.header>
  );
};

const mapStateToProps = (state) => ({
  error: state.error,
  url: state.url
});

export default connect(mapStateToProps)(Header);
