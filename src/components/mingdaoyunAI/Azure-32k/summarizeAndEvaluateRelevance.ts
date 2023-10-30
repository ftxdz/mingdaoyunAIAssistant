import { getAzureResult } from "./getAzureResult";
export async function summarizeAndEvaluateRelevance(chatLogs: string) {
  const prompt = `你是无代码开发工具Zion的销售人员，你的工作是判断用户的聊天记录里最后一句话是不是一个问题，
如果是，将用户的聊天记录整理为一个问题，如果有你们等字样，将其转换为Zion，帮在不知道上下文且不认识zion的情况下，查找资料，回答用户最后的问题，并判断总结的问题是否和["zion","无代码","明道云","AI应用"]相关，如果相关，返回 是，如果不是，就作为chatGPT回答用户的问题；
如果不是，就作为chatGPT回答用户的问题。
回答简介亲切。
Respond with only valid JSON conforming to the following JSONSchema:
           {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
              "isIssue": {
                "type": "boolean",
                "description": "判断用户的聊天记录里最后一句话是不是一个问题"
              },
              "summaryIssue": {
                "type": "string",
                "description": "总结的问题"
              },
              "relevant": {
                "type": "boolean",
                "description": "判断用户问题是否和["zion","无代码","明道云","AI应用"]相关"
              },
              "answer": {
                      "type": "string",
                      "description": "如果最后一个聊天记录不是问题，或总结的问题和["zion","无代码","明道云","AI应用"]不相关，作为chatGPT回答用户问题的答案；当不满足条件的时候为null"
                    }
            },
            "required": ["isIssue"],
            "additionalProperties": false
          }
## 聊天记录
${chatLogs}
## Respond（以json的格式）`;
  const responseByAzure = await getAzureResult({
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    temperature: 0,
  });
  try {
    return JSON.parse(responseByAzure.result.choices[0].message.content);
  } catch (error) {
    throw error;
  }
}
