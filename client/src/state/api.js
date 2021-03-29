import client from "../common/apiClient";

export async function loginUser(data) {
  const url = `api/auth/anonymous/login`;
  return await client(url, { body: data });
}

export async function createPoll(data) {
  const url = `/api/poll`;
  return await client(url, { body: data });
}
