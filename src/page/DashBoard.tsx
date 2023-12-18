import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import GoogleSignIn from "../component/GoogleSignIn";
import { firestore } from "../lib/firebase";
import { useAuth } from "../provider/AuthProvider";
import DashboardCard from "../component/DashboardCard";

const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  justify-content: center;
`;

type AccountDetail = {
  name: string;
  balance: number;
  tasks: Task[];
};

const DashBoard = () => {
  const { currentUser, logOut } = useAuth();
  const fidRef = useRef<string>(null!);
  const childAccountsRef = useRef<string[]>([]);
  const [accountsDetail, setAccountsDetail] = useState<AccountDetail[]>([]);
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
      childAccountsRef.current = accountsSnap.data().childUsers;
      const accountsDetailConsturctor: AccountDetail[] = [];
      for (const uid of childAccountsRef.current) {
        const promises = [
          getBalanceByUid(fidRef.current, uid),
          getNameByUid(uid),
          getOngoingTasksByUid(fidRef.current, uid),
        ];
        const [balance, name, tasks] = await Promise.all(promises);
        accountsDetailConsturctor.push({ name, balance, tasks });
        console.log(balance, name, tasks);
      }
      setAccountsDetail(accountsDetailConsturctor);
    };
    fetchData().catch((err) => console.error(err));
  }, [currentUser]);

  return !currentUser ? (
    <GoogleSignIn />
  ) : (
    <>
      <DashboardContainer>
        {accountsDetail.map((accountDetail, index) => (
          <DashboardCard key={index} {...accountDetail} />
        ))}
      </DashboardContainer>
    </>
  );
};

export default DashBoard;

const getBalanceByUid = async (fid: string, uid: string) => {
  const accountSnap = await getDoc(
    doc(firestore, "Families", fid, "Accounts", uid)
  );
  if (!accountSnap.exists()) throw new Error("No such document!");
  return accountSnap.data().fiatBalance;
};
const getNameByUid = async (uid: string) => {
  const userSnap = await getDoc(
    doc(firestore, "Users", uid, "Restricted", "Profile")
  );
  if (!userSnap.exists()) throw new Error("No such document!");
  return userSnap.data().displayName;
};

export type Task = {
  title: string;
  rewardFiatAmount: number;
};
const getOngoingTasksByUid = async (fid: string, uid: string) => {
  const q = query(
    collection(firestore, "Families", fid, "Tasks"),
    where("assigneeUIDs", "array-contains", uid), // replace "uid" with the actual uid
    where("status", "==", "ongoing"),
    where("rewardFiat", "==", true)
  );
  const tasks: Task[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    tasks.push({
      title: doc.data().title,
      rewardFiatAmount: doc.data().rewardFiatAmount,
    });
  });
  return tasks;
};
