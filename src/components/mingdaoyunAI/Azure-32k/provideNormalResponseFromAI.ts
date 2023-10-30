import { getAzureResultWithStream } from "./getAzureResultWithStream";
import { chatProps } from "../types";

export async function provideNormalResponseFromAI(question:string,reference:string,props:chatProps) {
  const prompt = `你是无代码开发工具Zion的销售人员，你的工作是根据资料回答用户的问题。回答尽量简洁亲切，以第一人称“我们”的方式回答问题
  ## 资料
  ${reference}
  ## 用户问题
  ${question}
  ## 回答`;
 await getAzureResultWithStream(props,{
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    stream:true,
    temperature: 0,
  });
}
