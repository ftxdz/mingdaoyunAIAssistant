
const url: string =
  "https://zion-app.functorz.com/mwRRZnqJQmn/zero/xAXj4omBbnn/api/graphql-v2";
  //需要整理一下这个token
const headers: Record<string, string> = {
  AUTHORIZATION:
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJoYXN1cmFfY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFkbWluIiwieC1oYXN1cmEtdXNlci1pZCI6IjEwMDk5OTk5OTk5OTk5OTkiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbImFkbWluIl19LCJ6ZXJvIjp7fSwicm9sZXMiOlsiYWRtaW4iXSwiWkVST19VU0VSX0lEIjoiMTAwOTk5OTk5OTk5OTk5OSIsImRlZmF1bHRSb2xlIjoiYWRtaW4ifQ.AbLaMV4nzMYyzVcWqbYU--44egEAPBy1gE6alT--8vw",
};

export async function runGql(query: string, variables: Record<string, any>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: JSON.stringify({ query, variables }, (_, v) => typeof v === 'bigint' ? v.toString() : v),

  });
  if (response.ok) {
    const result = await response.json();
    console.log(result.data);
    return { error: null, result: result };
  } else {
    console.log(response.status);
    return { error: response.status ,result:null};
  }
}
