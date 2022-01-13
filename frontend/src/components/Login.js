import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import welcome_mouth from '../utils/welcome_mouth.png';
import styled from 'styled-components/macro';

import { API_URL } from '../utils/constants';
import user from '../reducers/user';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signup');

  const accessToken = useSelector((store) => store.user.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };

    fetch(API_URL(mode), options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setError(null));
          });
        } else {
          batch(() => {
            dispatch(user.actions.setUserId(null));
            dispatch(user.actions.setUsername(null));
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setError(data.response));
          });
        }
      });
  };

  return (
    <>
      <MainWrapper>
        <div>
          <h1>WELCOME!</h1>{' '}
          <img src={welcome_mouth} alt="Big Mouth" height={300}></img>
        </div>
        <div>
          <Link to="/">To '/' !</Link>
        </div>
        <label htmlFor="signup">Signup</label>
        <input
          id="signup"
          type="radio"
          checked={mode === 'signup'}
          onChange={() => setMode('signup')}
        />
        <label htmlFor="signin">Signin</label>
        <input
          id="signin"
          type="radio"
          checked={mode === 'signin'}
          onChange={() => setMode('signin')}
        />
        <InputWrapper>
          <form onSubmit={onFormSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </InputWrapper>
      </MainWrapper>
    </>
  );
};

const MainWrapper = styled.section`
  background-color: yellow;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  max-width: 500px;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  text-align: center;
  max-width: 500px;
  .submit-button {
    width: 200px;
    padding: 1.3em 3em;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-weight: 700;
    color: #000;
    background-color: #fff;
    border: none;
    border-radius: 45px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;
    margin: 10px 100px 10px 100px;
    font-family: 'Arial ';
    /* @media (min-width: 768px) {
      width: 20vw;
      margin: 0 auto;
    } */
  }
  .input-field {
    background: #fff;
    color: $input-text-color;
    font: inherit;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
    border: 0;
    outline: 0;
    padding: 15px 12px;
    margin: 20px;
  }
`;

export default Login;
