import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, doc, query, onSnapshot, where } from "firebase/firestore";
import { firestore } from "../lib/firebase";

// const CardContainer = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   border: 1px solid;
//   border-radius: 1rem;
//   border-color: #e5e7eb;
//   margin: 1rem;
// `;

// const CardItem = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;
// const CardItemTeam = styled(CardItem)`
//   flex: 0;
// `;
const CardContainer = styled.div`
  flex: 1;
  max-width: 50%;
  min-width: fit-content;
  display: flex;
  flex-direction: column;
  color: #333;
  border: 3px solid #00b4eb;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const CardItem = styled.div`
  flex: 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-bottom: 2px solid #00b4eb;
`;

const CardItemTeam = styled(CardItem)`
  padding: 0;
  h1 {
    color: #00b4eb;
    padding: 0.4em;
  }
`;
const TransformSign = styled.h1`
  color: orange;
  font-size: 5em;
`;
const CardItemNumber = styled(CardItem)`
  padding: 0.5em;
`;
const CardItemNumberTotal = styled(CardItemNumber)`
  h1 {
    color: orange;
  }
`;
const CardItemPendingBalance = styled(CardItemNumber)`
  border-bottom: none;
`;
const CardItemTask = styled(CardItem)`
  border-bottom: none;
  flex: 1;
  align-items: stretch;
  gap: 1em;
  padding: 0 1em 1em 1em;
  justify-content: flex-start;
`;
// a single task
const SubTask = styled.div`
  font-size: 1.5em;
  background-color: #00b4eb;
  border-radius: 0.5em;
  padding: 5px 0.5em;
  color: #ffffff;
  // margin: 0.5em;
`;

type Task = {
  title: string;
  rewardFiatAmount: number;
};

const DashboardCard: React.FC<{
  fid: string;
  uid: string;
}> = ({ fid, uid }) => {
  const [name, setName] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [pendingBalance, setPendingBalance] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const getBalanceByUid = (fid: string, uid: string) => {
    const docRef = doc(firestore, "Families", fid, "Accounts", uid);

    onSnapshot(docRef, (doc) => {
      if (!doc.exists()) throw new Error("No such document!");
      console.log("Current fiatBalance", doc.data().fiatBalance);
      setBalance(doc.data().fiatBalance);
    });
  };

  const getNameByUid = (uid: string) => {
    const docRef = doc(firestore, "Users", uid, "Restricted", "Profile");

    onSnapshot(docRef, (doc) => {
      if (!doc.exists()) throw new Error("No such document!");
      console.log("Current name", doc.data().displayName);
      setName(doc.data().displayName);
    });
  };

  const getOngoingTasksByUid = (fid: string, uid: string) => {
    const q = query(
      collection(firestore, "Families", fid, "Tasks"),
      where("assigneeUIDs", "array-contains", uid), // replace "uid" with the actual uid
      where("status", "==", "ongoing"),
      where("rewardFiat", "==", true)
    );

    onSnapshot(q, (querySnapshot) => {
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push({
          title: doc.data().title,
          rewardFiatAmount: doc.data().rewardFiatAmount,
        });
      });
      console.log("Current tasks:", tasks);
      setTasks(tasks);
    });
  };
  useEffect(() => {
    getBalanceByUid(fid, uid);
    getNameByUid(uid);
    getOngoingTasksByUid(fid, uid);
  }, [fid, uid]);
  useEffect(() => {
    const pendingBalance = tasks.reduce((acc, cur) => {
      return cur.rewardFiatAmount + acc;
    }, 0);
    setPendingBalance(pendingBalance);
  }, [tasks]);

  return (
    <CardContainer>
      <CardItemTeam>
        <h1>{name}</h1>
      </CardItemTeam>
      <CardItemNumberTotal>
        <h2>Total</h2>
        <h1>$ {balance + pendingBalance}</h1>
      </CardItemNumberTotal>
      <CardItem>
        <TransformSign>=</TransformSign>
      </CardItem>
      <CardItemNumber>
        <h2>Cash</h2>
        <h1>$ {balance}</h1>
      </CardItemNumber>
      <CardItem>
        <TransformSign>+</TransformSign>
      </CardItem>
      <CardItemPendingBalance>
        <h2>Pending Balance</h2>
        <h1>$ {pendingBalance}</h1>
      </CardItemPendingBalance>
      <CardItemTask>
        {tasks.map((task, index) => (
          <SubTask key={index}>
            {task.title} $ {task.rewardFiatAmount}
          </SubTask>
        ))}
      </CardItemTask>
    </CardContainer>
  );
};

export default DashboardCard;
