// frontend/src/components/LoginFormModal/index.js
import React, {useEffect, useState} from "react";
import * as sessionActions from "../../store/session";
import {useDispatch} from "react-redux";
import {useModal} from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const {closeModal} = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({credential, password}))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(() => {
    if (!credential.length && !password.length) return;

    if (credential.length < 4) {
      setErrors({credential: "Username must be 4 characters or more"});
    } else if (password.length < 6) {
      setErrors({password: "Password must be 6 characters or more"});
    } else {
      setErrors({});
    }
  }, [credential, password]);

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        {errors.password && <p>{errors.password}</p>}
        <button type="submit" disabled={Object.keys(errors).length > 0}>
          Log In
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
