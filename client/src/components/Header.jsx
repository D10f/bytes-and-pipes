import { connect } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { logout } from '../redux/actions/user';
import ErrorMsg from '../components/ErrorMsg';
// import FileInput from './icons/FileInput';
// import FileOutput from './icons/FileOutput';

const dropdownAnimation = {
  initial: { y: -200 },
  visible: { y: 0 },
  exit: { y: -200 },
  transition: { delay: 0.2 }
};

const Header = ({ user, error, logout }) => {

  const title = 'Bytes And Pipes';

  const handleClick = () => {
    logout();
    // redirect to main page
  };

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
      </AnimatePresence>
      <Link to="/" tabIndex="-1">
        <motion.h1 className="header__logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1.1 }}
          transition={{ delay: 0.6 }}
        >
          {title}
        </motion.h1>
      </Link>
      <nav className="header__nav">
        <ul className="header__menu">
          { user ?
            <>
              <li className="header__item">
                <span>{user.username}</span>
              </li>
              <li className="header__item">
                <span>{user.storage}</span>
              </li>
              <li className="header__item">
                <button onClick={handleClick} className="header__link">Logout</button>
              </li>
            </>
            :
            <li className="header__item">
              <Link to="/login" tabIndex="-1">
                <button className="header__link">Login</button>
              </Link>
            </li>
          }
        </ul>
      </nav>
    </motion.header>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  error: state.error
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);