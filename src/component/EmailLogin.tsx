import React, { useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 20px auto;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

export const EmailSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sign in attempt with:", { email, password });
    try {
      await logIn(email, password);
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.error(
        "Sign in failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className='email-sign-in'>
      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <StyledLabel htmlFor='email'>Email:</StyledLabel>
          <StyledInput
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <StyledLabel htmlFor='password'>Password:</StyledLabel>
          <StyledInput
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <SubmitButton type='submit'>Sign In</SubmitButton>
      </StyledForm>
    </div>
  );
};
