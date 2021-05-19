import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {

  return (
    <motion.footer className="footer"
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <nav className="footer__nav">
        <ul className="footer__menu">
          <li className="footer__item">
            <a tabIndex="-1" href="https://github.com/herokunt/bytes-and-pipes">
              <button className="footer__link">Source</button>
            </a>
          </li>
          <li className="footer__item">
            <Link to="/about" tabIndex="-1">
              <button className="footer__link">About</button>
            </Link>
          </li>
          <li className="footer__item">
            <Link to="/how-it-works" tabIndex="-1">
              <button className="footer__link">How It Works</button>
            </Link>
          </li>
          <li className="footer__item">
            <Link tabIndex="-1" to="/privacy" >
              <button className="footer__link">Privacy Policy</button>
            </Link>
          </li>
          <li className="footer__item">
            <Link tabIndex="-1" to="/terms" >
              <button className="footer__link">Terms And Conditions</button>
            </Link>
          </li>
          <li className="footer__item">
            <Link tabIndex="-1" to="/d/123ako" >
              <button className="footer__link">Download Test</button>
            </Link>
          </li>
        </ul>
      </nav>
    </motion.footer>
  );
};

export default Footer;
