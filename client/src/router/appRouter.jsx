import { Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Intro from '../components/pages/Intro';
import Footer from '../components/Footer';
import About from '../components/pages/About';
import Terms from '../components/pages/Terms';
import Privacy from '../components/pages/Privacy';
import HowItWorks from '../components/pages/HowItWorks';
import Download from '../components/pages/Download';
import Login from '../components/pages/Login';

const AppRouter = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.key}>
          <Route path="/" exact component={Intro} />
          <Route path="/d" component={Download} />
          <Route path="/about" component={About} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/login" component={Login} />
        </Switch>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default AppRouter;
