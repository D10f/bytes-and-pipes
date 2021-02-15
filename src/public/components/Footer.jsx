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
            <Link to="https://github.com/herokunt/bytes-and-pipes" >
              <button className="footer__link">Source Code</button>
            </Link>
          </li>
          <li className="footer__item">
            <Link to="/privacy" >
              <button className="footer__link">Privacy Policy</button>
            </Link>
          </li>
          <li className="footer__item">
            <Link to="/terms" >
              <button className="footer__link">Terms And Conditions</button>
            </Link>
          </li>
        </ul>
      </nav>
    </motion.footer>
  );
};

export default Footer;
