
const url: string =
  "https://xaxj4ombbnn-ai.functorz.com/azure/openai/deployments/functorz-canada-east-gpt-4/chat/completions?api-version=2023-07-01-preview";

export async function getAzureResult(azureBody: Record<string, any>) {
  //console.log("AZURE",JSON.stringify(azureBody));
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(azureBody),
  }); //如果504要怎么办
  if (response.ok) {
    const result = await response.json();
    return { error: null, result: result };
  } else {
    console.log(response.status);
    return { error: response.status, result: null };
  }
}
