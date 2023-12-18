import React from "react";
import styled from "styled-components";
import { Task } from "../page/DashBoard";

const DashboardItem = styled.div`
  flex: 1 1 25%;
  align-self: stretch;
`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  margin: 1rem;
  height: 100%;
`;

const CardItem = styled.div`
  padding: 1rem;
`;

const DashboardCard: React.FC<{
  name: string;
  balance: number;
  tasks: Task[];
}> = ({ name, balance, tasks }) => {
  const pendingBalance = tasks.reduce((acc, cur) => {
    return cur.rewardFiatAmount + acc;
  }, 0);
  const totalBalance = balance + pendingBalance;

  return (
    <DashboardItem>
      <CardContainer>
        <CardItem>{name}</CardItem>
        <CardItem>Avaiable Balance: {balance}</CardItem>
        <CardItem>
          {tasks.map((task, index) => (
            <div key={index}>
              {task.title}: {task.rewardFiatAmount}
            </div>
          ))}
          Pending Balance: {pendingBalance}
        </CardItem>
        <CardItem>Total Balance: {totalBalance}</CardItem>
      </CardContainer>
    </DashboardItem>
  );
};

export default DashboardCard;
