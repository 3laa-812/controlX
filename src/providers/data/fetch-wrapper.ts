import { GraphQLFormattedError } from "graphql";

type Error = {
  message: string;
  statusCode: string;
};

const customFetch = async (url: RequestInfo, options: RequestInit) => {
  const accessToken = localStorage.getItem("access-token");
  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || `Bearer ${accessToken}`,
      "content-type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[]>
): Error | null => {
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }
  if ("errors" in body) {
    const errors = body?.errors;

    const messages = errors?.map((error) => error?.message)?.join("");
    const code = errors?.[0].extensions?.code;

    return {
      message: messages || JSON.stringify(errors),
      statusCode: code ? String(code) : "500",
    };
  }
  return null;
};

export const fetchWrapper = async (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  const response = await customFetch(
    input instanceof URL ? input.toString() : input,
    init || {}
  );

  const responseClone = response.clone();
  const body = await responseClone.json();

  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }

  return response;
};
