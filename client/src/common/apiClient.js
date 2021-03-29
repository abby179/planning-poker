class APIError extends Error {
  status;
  data;
  constructor(message, status, data, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    this.name = "APIError";
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

export default async function client(
  url,
  { body, ...customConfig } = { headers: {}, body: null }
) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  let data;
  try {
    data = await response.json();
  } catch (SyntaxError) {
    data = null;
  }

  if (!response.ok) {
    const responseData = data?.message || response.statusText;
    const redableError = data?.message
      ? JSON.stringify(data?.message)
      : response.statusText;
    const message = `Error ${response.status}: ${redableError}`;
    throw new APIError(message, response.status, responseData);
  }

  return data;
}
