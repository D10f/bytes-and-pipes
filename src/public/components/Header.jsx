import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SVGFileInput from './SVGFileInput';
import SVGFileOutput from './SVGFileOutput';

const Header = () => {

  const title = 'Bytes And Pipes';

  return (
    <motion.header className="header"
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <SVGFileInput />
      <Link to="/">
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

          <li className="header__item">
            <Link to="/about">
              <button className="header__link">About</button>
            </Link>
          </li>

          <li className="header__item">
            <Link to="/how-it-works">
              <button className="header__link">How It Works</button>
            </Link>
          </li>

          <li className="header__item">
            <Link to="/contact">
              <button className="header__link">Contact</button>
            </Link>
          </li>
        </ul>
      </nav>
      <SVGFileOutput />
    </motion.header>
  );
};

export default Header;
