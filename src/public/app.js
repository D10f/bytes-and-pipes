import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Intro from './components/Intro';
import Footer from './components/Footer';
import Document from './components/Document';

import data from './data';
import './styles.scss';

const App = () => {

  return (
    <Router>
      <Header />

      <Switch>
        <Route path="/about">
          <Document text={data.about} />
        </Route>
        <Route path="/how-it-works">
          <Document text={data.howItWorks} />
        </Route>
        <Route path="/terms">
          <Document text={data.terms} />
        </Route>
        <Route path="/privacy">
          <Document text={data.privacy} />
        </Route>
        <Route path="/">
          <Intro />
        </Route>
      </Switch>

      <Footer />
    </Router>
  );
};

render(<App />, document.getElementById('root'));
