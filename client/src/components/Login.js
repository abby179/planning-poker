import React, { useState } from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { v4 as uuidv4 } from "uuid";

import { useLoginUser } from "../state/queries";

const Login = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  // TODO: error handling
  const { mutate: handleLoginUser } = useLoginUser();

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name) {
      const userName = `${name}^${uuidv4()}`;
      handleLoginUser({ name, userName });
    } else {
      setError("This field cannot be empty.");
    }
  };

  return (
    <Container>
      <Typography variant="h6">Enter a username to continue</Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          error={!!error}
          helperText={error}
          id="name"
          label="Username"
          value={name}
          onChange={handleChange}
          autoFocus
        />
        <StyledButton variant="contained" color="primary" type="submit">
          Submit
        </StyledButton>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  align-items: baseline;
`;

const StyledButton = styled(Button)`
  margin-left: 0.75rem;
`;

export default Login;
