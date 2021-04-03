import React from "react";
import styled from "styled-components";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import AppFrame from "./components/AppFrame";
import Login from "./components/Login";
import Create from "./components/Create";
import Poll from "./components/Poll";
import { get } from "./common/localStorage";

const queryClient = new QueryClient();

function App() {
  const me = get("__planning_poker_user");

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppFrame>
          {me ? (
            <Switch>
              <Redirect exact from="/" to="/create" />
              <Route exact path="/create" component={Create} />
              <Route exact path="/poll/:pollId" component={Poll} />
            </Switch>
          ) : (
            <Login />
          )}
          <Container></Container>
        </AppFrame>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export default App;
