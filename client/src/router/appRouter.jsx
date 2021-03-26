import { Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Intro from '../components/Intro';
import Footer from '../components/Footer';
import Document from '../components/Document';
import Login from '../components/Login';

const AppRouter = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.key}>
          <Route path="/about" component={Document} />
          <Route path="/how-it-works" component={Document} />
          <Route path="/terms" component={Document} />
          <Route path="/privacy" component={Document} />
          <Route path="/login" component={Login} />
          <Route path="/" exact component={Intro} />
        </Switch>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default AppRouter

// <Route path="/" component={Dashboard} exact />
// <Route path="/create" component={AddExpensePage} />
// <Route path="/edit/:id" component={EditExpensePage} />
// <Route path="/help" component={HelpPage} />
// <Route component={NotFound} />
