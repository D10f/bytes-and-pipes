import { motion } from 'framer-motion';

const Header = ({ title, navLinks }) => (
  <motion.header className="header"
    initial={{ y: -200 }}
    animate={{ y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <motion.h1 className="header__logo"
      initial={{ scale: 0 }}
      animate={{ scale: 1.1 }}
      transition={{ delay: 0.6 }}
    >
    {title}
    </motion.h1>
    <nav className="header__nav">
      <ul className="header__menu">
        {
          navLinks.map(link => (
            <li className="header__item" key={Math.random()}>
              <a className="header__link" href="#">{link}</a>
            </li>
          ))
        }
      </ul>
    </nav>
  </motion.header>
);

export default Header;
