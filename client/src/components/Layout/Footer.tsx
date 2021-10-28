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
            <a className="footer__link" tabIndex={0} href="https://github.com/herokunt/bytes-and-pipes">
              Source
            </a>
          </li>
          <li className="footer__item">
            <Link className="footer__link" tabIndex={0} to="/about">
              About
            </Link>
          </li>
          <li className="footer__item">
            <Link className="footer__link" tabIndex={0} to="/privacy" >
              Privacy Policy
            </Link>
          </li>
          <li className="footer__item">
            <Link className="footer__link" tabIndex={0} to="/terms" >
              Terms And Conditions
            </Link>
          </li>
        </ul>
      </nav>
    </motion.footer>
  );
};

export default Footer;
