import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@hooks/app';
import Header from '@layout/Header/Header';
import Footer from '@layout/Footer/Footer';
import Toast from '@components/Toast/Toast';

import './AppLayout.scss';

const AppLayout = ({ children }: { children: React.ReactNode }) => {

  const error = useAppSelector(state => state.error);

  return (
    <main className="app">
      <Header />
      {children}
      <Footer />
      <AnimatePresence>
        { error && <Toast message={error} /> }
      </AnimatePresence>
    </main>
  );
};

export default AppLayout;
