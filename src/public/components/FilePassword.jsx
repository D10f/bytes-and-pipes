import { useState } from 'react';
import { connect } from 'react-redux';
import { setPassword, toggleVisibility } from '../redux/actions/password';
import { setError } from '../redux/actions/error';
import PasswordInput from './PasswordInput';

const FilePassword = ({ setError, password, showPassword, setPassword, toggleVisibility }) => {

  const handlePasswordInput = value => {
    setError('');
    setPassword(value);
  };

  return (
    <PasswordInput
      password={password}
      setPassword={handlePasswordInput}
      passwordSuggestions={true}
    />
  );
;}

const mapStateToProps = (state) => ({
  ...state.password
});

const mapDispatchToProps = (dispatch) => ({
  setPassword: (password) => dispatch(setPassword(password)),
  setError: (msg) => dispatch(setError(msg)),
  toggleVisibility: () => dispatch(toggleVisibility())
});

export default connect(mapStateToProps, mapDispatchToProps)(FilePassword);
