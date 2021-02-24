import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store/store';

import AppRouter from './router/appRouter';

import './styles.scss';

const App = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

render(<App />, document.getElementById('root'));
