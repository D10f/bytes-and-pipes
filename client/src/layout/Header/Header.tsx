import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { HEADER_TITLE } from '@utils/constants';

import './Header.scss';

const dropdownAnimation: Variants = {
  initial: { y: -200 },
  visible: { y: 0 },
  exit: { y: -200 }
};

const popAnimation: Variants = {
  initial: { scale: 0 },
  animate: { scale: 1.1 },
};

const Header = () => (
  <motion.header
    className="header"
    variants={dropdownAnimation}
    initial="initial"
    animate="visible"
    exit="initial"
    transition={{ delay: 0.2 }}
  >

    <Link to="/">
      <motion.h1
        className="header__title"
        variants={popAnimation}
        initial="initial"
        animate="animate"
        transition={{
          delay: 0.6,
          duration: 0.45,
          type: 'spring'
        }}
      >
        {HEADER_TITLE}
      </motion.h1>
    </Link>

  </motion.header>
);

export default Header;
