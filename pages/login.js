import styled from "styled-components";
import Head from "next/head";
import { Button } from "@mui/material";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { useState } from "react";
function Login() {
  const [mynumber, setnumber] = useState("+963");
  const [otp, setotp] = useState("");
  const [show, setshow] = useState(false);
  const [final, setfinal] = useState("");

  const whatsappLogo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2042px-WhatsApp.svg.png";

  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert);
  };

  const signin = () => {
    if (mynumber === "" || mynumber.length < 10) return;

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {},
      },
      auth
    );
    let verify = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, mynumber, verify)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setfinal(confirmationResult);
        alert("code sent");
        setshow(true);
      })
      .catch((error) => {});
  };

  const ValidateOtp = () => {
    if (otp === null || final === null) return;
    final
      .confirm(otp)
      .then((result) => {})
      .catch((err) => {
        alert("Wrong code");
      });
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <>
        <center>
          <LoginContainer style={{ display: !show ? "block" : "none" }}>
            <h2 style={{ paddingBottom: "2rem" }}>Please enter phone number</h2>
            <Inputs
              className="searchIcon"
              value={mynumber}
              onChange={(e) => {
                setnumber(e.target.value);
              }}
              placeholder="phone number"
            />
            <br />
            <br />
            <div id="recaptcha-container"></div>
            <Buttons onClick={signin}>Send OTP</Buttons>
          </LoginContainer>
          <LoginContainer style={{ display: show ? "block" : "none" }}>
            <h2 style={{ paddingBottom: "2rem" }}>Please enter OTP code</h2>
            <Inputs1
              type="text"
              placeholder={"Enter your OTP"}
              onChange={(e) => {
                setotp(e.target.value);
              }}
            ></Inputs1>
            <br />
            <br />
            <Buttons onClick={ValidateOtp}>Verify</Buttons>
          </LoginContainer>
        </center>
      </>

      {/* <LoginContainer>
        <Logo src={whatsappLogo} />
        <Button onClick={signIn} variant="outlined">
          Sign in with Google
        </Button>
      </LoginContainer> */}
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  background-color: #111b21;
`;

const LoginContainer = styled.div`
  padding: 60px 100px;
  display: flex;
  flex-direction: column;
  place-items: center;
  justify-content: center;
  background-color: #202c33;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
const Inputs = styled.input`
  width: 15rem;
  height: 2rem;
  border-radius: 0.5rem;
  outline-width: 0;
  border: none;
  background-color: #d1d7db;
  padding-left: 1rem;
  color: #202c33;
  margin-left: -3rem;
`;
const Inputs1 = styled.input`
  width: 15rem;
  height: 2rem;
  border-radius: 0.5rem;
  outline-width: 0;
  border: none;
  background-color: #d1d7db;
  padding-left: 1rem;
  color: #202c33;
`;
const Buttons = styled.button`
  background-color: var(--primaryFontColor);
  border: none;
  cursor: pointer;
  color: var(--secondaryColor);
  outline: none;
  padding: 0.5rem 2rem;
  border-radius: 0.3rem;
  transition: 0.4s all;

  :hover {
    background-color: #636567;
    color: #f7f7f7;
  }
`;
