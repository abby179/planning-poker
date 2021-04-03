import { useQuery, useMutation, useQueryClient } from "react-query";

import { set } from "../common/localStorage";
import { loginUser, createPoll, getPoll } from "./api";

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
  return useMutation(({ title, me }) =>
    createPoll({ title: title, created_by: me })
  );
};

export const useQueryPoll = (id) => {
  return useQuery(["poll", id], () => getPoll(id), {
    refetchOnWindowFocus: false,
  });
};
