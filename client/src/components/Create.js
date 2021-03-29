import React, { useState } from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

import { useCreatePoll } from "../state/queries";

const Create = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  // TODO: error handling
  const {
    mutate: handleCreatePoll,
    isError: isCreateError,
    error: createError,
  } = useCreatePoll();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setError("");
    setTitle("");
  };

  const handleChange = (event) => {
    setError("");
    setTitle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title) {
      handleCreatePoll(title);
      setOpen(false);
    } else {
      setError("This field cannot be empty.");
    }
  };

  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleClickOpen}
        startIcon={<NoteAddIcon />}
      >
        Create a new story
      </Button>
      <StyledDialog onClose={handleClose} open={open}>
        <DialogTitle>Create a story for planning</DialogTitle>
        <DialogContent>
          <StyledTextField
            error={!!error}
            helperText={error}
            id="title"
            label="Summary"
            value={title}
            onChange={handleChange}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            submit
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: 36rem;
    padding: 2rem;
  }
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

export default Create;
