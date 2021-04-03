import React from "react";
import styled from "styled-components";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { get } from "../common/localStorage";

const AppFrame = ({ children }) => {
  const displayUser = get("__planning_poker_user")?.split("^")[0];

  return (
    <MainContent>
      <AppBar position="static">
        <StyledToolbar>
          <Typography variant="h6">Planning Poker</Typography>
          {displayUser && (
            <Typography variant="subtitle1">Hello, {displayUser}</Typography>
          )}
        </StyledToolbar>
      </AppBar>
      {children}
    </MainContent>
  );
};

const MainContent = styled.main`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
  align-items: center;
`;

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`;

export default AppFrame;
