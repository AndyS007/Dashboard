import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DashboardCard from "../component/DashboardCard";
import GoogleSignIn from "../component/GoogleSignIn";
import { firestore } from "../lib/firebase";
import { useAuth } from "../provider/AuthProvider";
import { EmailSignIn } from "../component/EmailLogin";
import { MdLogout } from "react-icons/md";

const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  gap: 1rem;
  height: 100%;
  min-height: 100vh;
  padding: 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const LoginInContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LogoutButtonContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const DashBoard = () => {
  const { currentUser, logOut } = useAuth();
  const fidRef = useRef<string>(null!);
  const [childUIDs, setChildUIDs] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      const docRef = doc(firestore, "Users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("No such document!");
      }
      const data = docSnap.data();
      fidRef.current = data.fid;
      const accountsSnap = await getDoc(
        doc(firestore, "Families", fidRef.current)
      );
      if (!accountsSnap.exists()) {
        throw new Error("No such document!");
      }
      setChildUIDs(accountsSnap.data().childUsers);
    };
    fetchData().catch((err) => console.error(err));
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {!currentUser ? (
        <LoginInContainer>
          <div>
            <h1>FinPod Game</h1>
            <h2>Sign in to start</h2>
          </div>
          <div>
            <EmailSignIn />

            <GoogleSignIn />
          </div>
        </LoginInContainer>
      ) : (
        <>
          <LogoutButtonContainer>
            <LogoutButton onClick={handleLogout} title='Logout'>
              <MdLogout />
            </LogoutButton>
          </LogoutButtonContainer>
          <DashboardContainer>
            {childUIDs.map((childUID, index) => (
              <DashboardCard key={index} fid={fidRef.current} uid={childUID} />
            ))}
          </DashboardContainer>
        </>
      )}
    </>
  );
};

export default DashBoard;
