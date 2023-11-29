interface GraphQLResponse<T> {
  data: T;
  errors?: Record<string, unknown>[];
}

const makeRequest = async <T>(query: string): Promise<T> => {
  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const { data, errors }: GraphQLResponse<T> = await response.json();

    if (errors) {
      console.warn("GraphQL request returned errors:", errors);
      throw new Error(JSON.stringify(errors));
    }

    return data;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
};

export default makeRequest;
