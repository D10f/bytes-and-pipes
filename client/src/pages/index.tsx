import React, { Suspense, lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from '@components/Layout/Header';
import Footer from '@components/Layout/Footer';

import Landing  from '@pages/Landing';
import Download from './Download';

const About   = lazy(() => import('@pages/About'));
const Terms   = lazy(() => import('@pages/Terms'));
const Privacy = lazy(() => import('@pages/Privacy'));

const AppRouter = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <AnimatePresence exitBeforeEnter>
        <Suspense fallback={<></>}>
          <Switch location={location} key={location.key}>
            <Route path="/" exact component={Landing} />
            <Route path="/d" component={Download} />
            <Route path="/about" component={About} />
            <Route path="/terms" component={Terms} />
            <Route path="/privacy" component={Privacy} />
          </Switch>
        </Suspense>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default AppRouter;
