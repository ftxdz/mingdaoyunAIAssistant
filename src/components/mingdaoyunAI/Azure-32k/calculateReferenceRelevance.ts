import { getAzureResult } from "./getAzureResult";
export async function calculateReferenceRelevance(
  reference: string,
  question: string
) {
  const prompt = `你是无代码开发工具Zion的销售人员，你的工作是判断资料是否和用户问题相关
  Respond with only valid JSON conforming to the following JSONSchema:
    {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "relevant": {
        "type": "boolean",
        "description": "判断资料是否存在和用户问题相关的内容"
      },
      "material": {
        "type": "array",
        "items": {
          "type": "integer",
          "description": "和用户问题相关的资料id"
        }
      }
    },
    "required": ["relevant","material"],
    "additionalProperties": false
  }
  ## 资料
  ${reference}
  ## 用户问题
  ${question}
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
    const result = JSON.parse(
      responseByAzure.result.choices[0].message.content
    );
    // console.log(result.material);
    // console.log(result.relevant);

    return result;
  } catch (error) {
    throw error;
  }
}
