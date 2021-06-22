import { Suspense, lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from '../components/Header';
import Intro from '../components/pages/Intro';
import Footer from '../components/Footer';
import Download from '../components/pages/Download';

// import Login from '../components/pages/Login';
const About   = lazy(() => import('../components/pages/About'));
const Terms   = lazy(() => import('../components/pages/Terms'));
const Privacy = lazy(() => import('../components/pages/Privacy'));

const AppRouter = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <AnimatePresence exitBeforeEnter>
        <Suspense fallback={<></>}>
          <Switch location={location} key={location.key}>
            <Route path="/" exact component={Intro} />
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
