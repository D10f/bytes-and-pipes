import { motion } from 'framer-motion';

const Footer = ({ navLinks }) => (
  <motion.footer className="footer"
    initial={{ y: 200 }}
    animate={{ y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <nav className="footer__nav">
      <ul className="footer__menu">
        {
          navLinks.map(link => (
            <li className="footer__item" key={Math.random()}>
              <a className="footer__link" href="#">{link}</a>
            </li>
          ))
        }
      </ul>
    </nav>
  </motion.footer>
);

export default Footer;
