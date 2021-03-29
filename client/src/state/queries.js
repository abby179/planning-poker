import { useQuery, useMutation, useQueryClient } from "react-query";

import { set } from "../common/localStorage";
import { loginUser, createPoll } from "./api";

export const useLoginUser = () => {
  return useMutation(
    ({ name, userName }) => loginUser({ name: name, user_name: userName }),
    {
      onSuccess: (data, { userName }) => {
        set("__planning_poker_user", userName);
        window.location.reload();
      },
    }
  );
};

export const useCreatePoll = () => {
  return useMutation((title) => createPoll({ title: title }));
};
