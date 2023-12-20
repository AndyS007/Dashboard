import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DashboardCard from "../component/DashboardCard";
import GoogleSignIn from "../component/GoogleSignIn";
import { firestore } from "../lib/firebase";
import { useAuth } from "../provider/AuthProvider";

const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
`;

const DashBoard = () => {
  const { currentUser } = useAuth();
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

  return (
    <>
      {!currentUser ? (
        <LoginInContainer>
          <div>
            <h1>FinPod Game</h1>
            <h2>Sign in to start</h2>
          </div>
          <GoogleSignIn />
        </LoginInContainer>
      ) : (
        <DashboardContainer>
          {childUIDs.map((childUID, index) => (
            <DashboardCard key={index} fid={fidRef.current} uid={childUID} />
          ))}
        </DashboardContainer>
      )}
    </>
  );
};

export default DashBoard;
