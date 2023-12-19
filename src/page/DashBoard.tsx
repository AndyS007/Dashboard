import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DashboardCard from "../component/DashboardCard";
import GoogleSignIn from "../component/GoogleSignIn";
import { firestore } from "../lib/firebase";
import { useAuth } from "../provider/AuthProvider";

const DashboardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
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

  return (
    <>
      <DashboardContainer>
        {!currentUser ? (
          <GoogleSignIn />
        ) : (
          childUIDs.map((childUID, index) => (
            <DashboardCard key={index} fid={fidRef.current} uid={childUID} />
          ))
        )}
      </DashboardContainer>
    </>
  );
};

export default DashBoard;
