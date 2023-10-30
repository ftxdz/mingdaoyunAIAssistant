import { getAzureResultWithStream } from "./getAzureResultWithStream";
import { chatProps } from "../types";

export async function recommendColleaguesToUserFromAI(chatLogs: string,props:chatProps) {
  const prompt = `你是无代码开发工具Zion的销售人员，你没有足够的信息回答用户的问题，需要和客户表达歉意，并推荐咨询专家Tim，为其解答问题；回答严谨亲切；
  ## 用户问题
  ${chatLogs}
  ## 例子
  您问的问题真挺有深度的，但我怕我解释得不够详细。要不这样，我们可以让我们的咨询专家Tim来给您解答，他能提供更多详细的信息。您可以通过这个二维码联系到他，他非常乐意帮助您。这样可能解释得更清楚一些，也更细致。
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
