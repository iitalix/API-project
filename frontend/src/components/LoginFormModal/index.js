// frontend/src/components/LoginFormModal/index.js
import React, {useEffect, useState} from "react";
import * as sessionActions from "../../store/session";
import {useDispatch} from "react-redux";
import {useModal} from "../../context/Modal";
import "./LoginForm.css";
import "../../index.css"

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const {closeModal} = useModal();

  const handleSubmit = (e, demoUser = false) => {
    e.preventDefault();

    const demoUserObj = demoUser
      ? {credential: "DemoUser", password: "password"}
      : {credential, password};

    setErrors({});
    return dispatch(sessionActions.login(demoUserObj))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="modal-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            className="modal-input"
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="modal-input"
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button
          type="submit"
          className="login-button"
          disabled={credential.length < 4 || password.length < 6}
        >
          Log In
        </button>
        <button className="demo-button" onClick={(e) => handleSubmit(e, "demoUser")}>
          Log in as Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
