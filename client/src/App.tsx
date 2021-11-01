import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import store from '@redux/store';

import AppLayout from '@layout/AppLayout/AppLayout';
import LandingPage from '@pages/LandingPage/LandingPage';
import DownloadPage from '@pages/DownloadPage/DownloadPage';
const AboutPage = lazy(() => import('@pages/AboutPage/AboutPage'));
const TermsPage = lazy(() => import('@pages/TermsPage/TermsPage'));
const PrivacyPage = lazy(() => import('@pages/PrivacyPage/PrivacyPage'));

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AnimatePresence exitBeforeEnter>
          <AppLayout>
            <Suspense fallback={<></>}>
              <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/privacy" component={PrivacyPage} />
                <Route path="/terms" component={TermsPage} />
                <Route path="/d" component={DownloadPage} />
              </Switch>
            </Suspense>
          </AppLayout>
        </AnimatePresence>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
