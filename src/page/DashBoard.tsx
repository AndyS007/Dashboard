import React from "react";
import styled from "styled-components";
import { useAuth } from "../provider/AuthProvider";
import GoogleSignIn from "../component/GoogleSignIn";

const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardItem = styled.div`
  flex: 0 0 25%;
  padding: 20px;
`;

const DashBoard = () => {
  const { currentUser, logOut } = useAuth();

  if (!currentUser) {
    return <GoogleSignIn />;
  }
  return (
    <>
      <button onClick={logOut}>Log out</button>
      <DashboardContainer>
        <DashboardItem>Item 1</DashboardItem>
        <DashboardItem>Item 2</DashboardItem>
        <DashboardItem>Item 3</DashboardItem>
        <DashboardItem>Item 4</DashboardItem>
        <DashboardItem>Item 5</DashboardItem>
        <DashboardItem>Item 6</DashboardItem>
        <DashboardItem>Item 6</DashboardItem>
        <DashboardItem>Item 6</DashboardItem>
      </DashboardContainer>
    </>
  );
};

export default DashBoard;
