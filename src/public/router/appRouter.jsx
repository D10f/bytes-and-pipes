import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../components/Header';
import Intro from '../components/Intro';
import Footer from '../components/Footer';
import Document from '../components/Document';
import Login from '../components/Login';

const AppRouter = () => (
  <BrowserRouter>
    <>
      <Header />
      <Switch>
        <Route path="/about" component={Document} />
        <Route path="/how-it-works" component={Document} />
        <Route path="/terms" component={Document} />
        <Route path="/privacy" component={Document} />
        <Route path="/login" component={Login} />
        <Route path="/" exact component={Intro} />
      </Switch>
      <Footer />
    </>
  </BrowserRouter>
)

export default AppRouter

// <Route path="/" component={Dashboard} exact />
// <Route path="/create" component={AddExpensePage} />
// <Route path="/edit/:id" component={EditExpensePage} />
// <Route path="/help" component={HelpPage} />
// <Route component={NotFound} />
