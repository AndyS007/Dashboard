import React from "react";
import { useAuth } from "../provider/AuthProvider";

const GoogleSignIn = () => {
  const { signInWithGoogle } = useAuth();

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};
export default GoogleSignIn;
