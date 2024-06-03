import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiURL } from '../../utils.js';
import useAuth from '../../components/UserContext.js';
import './styles.css';

const Login = () => {
  const [searchParams, _setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  let code = searchParams.get('code');

  const loginEffectRan = useRef(false); // Strict Mode bandaid
  useEffect(() => {
    if (!code) {
      return;
    }

    if (loginEffectRan.login) {
      return;
    }

    let apiURL = getApiURL();

    fetch(apiURL + '/api/auth?code=' + code).then((res) => {
      if (!res.ok) {
        res.json().then((data) => {
          alert(data);
        })
        return;
      }
      res.json().then((data) => {
        setCurrentUser(data);
        navigate("/");
      });
    }).catch((err) => {
      alert("ERROR!", err);
    })

    return () => loginEffectRan.login = true;
  }, [code]);

  return (
    <main id="login-page">
      <h1>Login Page</h1>
      {code &&
      <>
        You are being logged in, please wait for our servers to process the request.
      </>}
      {!code &&
      <>
        Why are you here without a code?
      </>}
    </main>
  );
};

export default Login;
