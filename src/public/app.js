import './styles.scss';

import { render } from 'react-dom';
import Header from './components/Header';
import Intro from './components/Intro';
import Footer from './components/Footer';

const App = () => {

  const title = 'Bytes And Pipes';
  const headline = 'Share Your Files In Privacy';
  const headerNav = ['About', 'How It Works', 'Contact'];
  const footerNav = ['Source Code', 'Privacy Policy', 'Terms And Conditions'];

  return (
    <>
      <Header title={title} navLinks={headerNav} />
      <Intro headline={headline} />
      <Footer navLinks={footerNav} />
    </>
  );
};

render(<App />, document.getElementById('root'));
