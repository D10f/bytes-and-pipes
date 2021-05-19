import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import AppRouter from './router/appRouter';

import './styles.scss';

const App = () => {

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('./serviceWorker.js')
  //   .then(console.log)
  //   .catch(console.error);
  // }

  return (
    <Provider store={store}>
      <Router>
        <AppRouter />
      </Router>
    </Provider>
  );
};

render(<App />, document.getElementById('root'));
