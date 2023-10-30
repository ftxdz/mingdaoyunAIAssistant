import { chatProps } from "../types";
import { createChatLogByUserId } from "../runGql/createChatLogByUserId";
import { inputStatusEnum } from "../enums";

const API_URL =
  "https://xaxj4ombbnn-ai.functorz.com/azure/openai/deployments/functorz-canada-east-gpt-4/chat/completions?api-version=2023-07-01-preview";
interface ChatCompletionChoices {
  index: number;
  delta: delta[];
}
interface delta {
  content: string;
}
interface StreamResponse {
  id: string;
  object: string;
  created: bigint;
  model: string;
  choices: ChatCompletionChoices[];
}

async function fetchFromAzure(
  azureBody: Record<string, any>
): Promise<ReadableStream | null> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(azureBody),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.body || null;
}

function extractJsonDataFromStreamValue(value: Uint8Array): any {
  const decoder = new TextDecoder("utf-8");
  const stringValue = decoder.decode(value);

  // 修改后的代码
  const matchs = stringValue.match(/data: (\{.*\})/g);
  const resultArr: StreamResponse[] = [];
  if (matchs)
    matchs.forEach((stringValueReal) => {
      const match = stringValueReal.match(/data: (\{.*\})/s);
      if (match && match[1]) {
        try {
          resultArr.push(JSON.parse(match[1]));
        } catch (error) {
          console.error("No JSON data found in the content.");
        }
        
      }
    });
  return resultArr;
}

export async function getAzureResultWithStream(
  props: chatProps,
  azureBody: Record<string, any>
) {
  try {
    const bodyStream = await fetchFromAzure(azureBody);

    if (!bodyStream) {
      throw new Error("ReadableStream 不可用!");
    }

    const reader = bodyStream.getReader();
    let assistantAnswer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Stream complete.");
        await createChatLogByUserId(props.globalData.userId, assistantAnswer);
        props.setGlobalData({
          ...props.globalData,
          inputStatus: inputStatusEnum.idle,
        });
        break;
      }

      // 这里返回的数组，所以也需要处理一下
      const jsonDatas = extractJsonDataFromStreamValue(value);
      jsonDatas.forEach((jsonData: Record<string, any>) => {
        if (
          jsonData?.choices?.length > 0 &&
          jsonData.choices[0].delta.content
        ) {
          assistantAnswer += jsonData.choices[0].delta.content;
          props.setGlobalData({
            ...props.globalData,
            inputStatus: inputStatusEnum.inProgress,
            assistantContent: assistantAnswer,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
}
