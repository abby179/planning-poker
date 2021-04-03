import React, { useMemo, useCallback } from "react";
import styled from "styled-components";
import useWebSocket from "react-use-websocket";
import { CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";

import { useQueryPoll } from "../state/queries";
import { get } from "../common/localStorage";

const POINT_MAP = {
  sp_0: "0",
  sp_0_5: "1/2",
  sp_1: "1",
  sp_2: "2",
  sp_3: "3",
  sp_5: "5",
  sp_8: "8",
  sp_13: "13",
};

const Poll = ({ match }) => {
  const me = get("__planning_poker_user");
  const pollId = match.params.pollId;
  const { data, isLoading, error } = useQueryPoll(pollId);

  const socketUrl = `ws://localhost:8000/ws`;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl
  );

  const poll = useMemo(() => lastJsonMessage || data, [data, lastJsonMessage]);

  const handleVote = useCallback(
    (key) => {
      sendJsonMessage({
        route: "poll/vote",
        user_name: me,
        poll_id: pollId,
        type: key,
      });
    },
    [me, pollId, sendJsonMessage]
  );

  const handleWithdraw = useCallback(() => {
    sendJsonMessage({
      route: "poll/withdraw",
      user_name: me,
      poll_id: pollId,
    });
  }, [me, pollId, sendJsonMessage]);

  const currentVote = useMemo(
    () => poll && poll.votes.find((vote) => vote.user.user_name === me),
    [me, poll]
  );

  if (error) {
    return (
      <Container>
        <Typography variant="h6">Requested page was not found.</Typography>
      </Container>
    );
  }

  // ws closed
  if (readyState === 3) {
    return (
      <Container>
        <Typography variant="h6">
          Connection lost, refresh the page to reconnect
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      {isLoading || readyState !== 1 ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h6">{poll.title}</Typography>
          <Choices>
            {Object.keys(POINT_MAP).map((key) => {
              return (
                <Wrapper key={key}>
                  <Badge
                    badgeContent={
                      poll.votes.filter((vote) => vote.type === key).length
                    }
                    color="primary"
                  >
                    <StyledChip
                      variant={
                        currentVote?.type === key ? "default" : "outlined"
                      }
                      label={POINT_MAP[key]}
                      onClick={() => handleVote(key)}
                      color="primary"
                      disabled={!!currentVote}
                    />
                  </Badge>
                </Wrapper>
              );
            })}
          </Choices>
          {currentVote && (
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleWithdraw}
            >
              withdraw vote
            </StyledButton>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-top: 5rem;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Choices = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const Wrapper = styled.div`
  margin: 1rem;
`;

const StyledChip = styled(Chip)`
  width: 6rem;
`;

const StyledButton = styled(Button)`
  margin-top: 2rem;
`;

export default Poll;
