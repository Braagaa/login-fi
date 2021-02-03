import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import DirectWeb from "../vendor/loginid.directweb.min";
import Browser from "../vendor/loginid.browser.min.js";
import isEmail from "isemail";
import { data } from "../data/";
import Modal from "./Modal";

enum Mode {
  Login = 0,
  Register,
}

const dw = new DirectWeb(data.BASE_URL, data.API_KEY);
const noFIDO2Message =
  "Your device does not support a FIDO2 athenticator. Resorting to username and password.";

const Login = function () {
  const [mode, setMode] = useState<number>(Mode.Login);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState(-1);
  const [supportFido2, setSupportFido2] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(id);
    const newId = window.setTimeout(() => {
      if (isEmail.validate(username, { errorLevel: true })) {
        setError("Email is invalid");
      }
    }, 500);
    setId(newId);
    setError("");
    setUserName(event.target.value);
  };
  const passwordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const changeMode = () => {
    setMode((prev) => (prev === Mode.Login ? Mode.Register : Mode.Login));
  };
  const toggleOffHandler = () => {
    setResult(null);
  };
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEmail.validate(username, { errorLevel: true })) {
      setError("Email is invalid");
      return;
    }
    try {
      if (mode === Mode.Register) {
        const result = await dw.register(username);
        setResult(result);
      } else if (mode === Mode.Login) {
        const result = await dw.login(username);
        setResult(result);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    Browser.isFido2Supported().then((result: boolean) =>
      setSupportFido2(result)
    );
  }, []);

  return (
    <form className="login__wrapper" onSubmit={submitHandler}>
      <h1 className="login__header">Welcome</h1>
      <h2>Bing-Bong</h2>
      {!supportFido2 && <div className="warning">{noFIDO2Message}</div>}
      <div className="error">{error}</div>
      <input
        value={username}
        className="login__input"
        onChange={inputHandler}
        placeholder="Email"
      />
      {!supportFido2 && (
        <input
          value={password}
          className="login__input"
          onChange={passwordHandler}
          placeholder="Password"
          type="password"
        />
      )}
      <button
        className="login__button"
        type="submit"
        disabled={!username || !!error}
      >
        {mode === Mode.Login ? "Login" : "Register"}
      </button>
      <button className="register__button" type="button" onClick={changeMode}>
        {mode === Mode.Register ? "Login" : "Register"}
      </button>
      <Modal toggleOff={toggleOffHandler} on={!!result} result={result} />
    </form>
  );
};

export default Login;
