import getUserChatLogsFromDB from "../runGql/getUserChatLogsFromDB";
import { summarizeAndEvaluateRelevance } from "../Azure-32k/summarizeAndEvaluateRelevance";
import { createChatLogByUserId } from "../runGql/createChatLogByUserId";
import { createLastChatLogAndQRcodeByUserId } from "../runGql/createLastChatLogAndQRcodeByUserId";
import { recommendColleaguesToUserFromAI } from "../Azure-32k/recommendColleaguesToUserFromAI";
import { chatProps } from "../types";
import { getSimilarMaterials } from "./getSimilarMaterials";
import { provideNormalResponseFromAI } from "../Azure-32k/provideNormalResponseFromAI";
import { json } from "react-router-dom";
import { inputStatusEnum } from "../enums";


const errorMessageByIsIssue = "";
interface summarizeAndEvaluateRelevanceType {
  isIssue: boolean;
  summaryIssue: string;
  relevant: boolean;
  answer: string;
}
export async function chatCompletion(userId: bigint, props: chatProps) {
  console.log("userId", userId);
  if (!userId) {
    console.log("没有userid");
    return;
  }
  const chatLogs = await getUserChatLogsFromDB(userId);
  if (chatLogs.length < 2) {
    throw new Error("缺少聊天记录");
  }
  if (chatLogs.length >= 10) {
    //用户提问超过或等于第五次
    await recommendColleaguesToUserFromAI(JSON.stringify(chatLogs), props);
    return;
  }
  //总结判断是否习惯

  const summarizeAndEvaluateRelevanceResult: summarizeAndEvaluateRelevanceType =
    await summarizeAndEvaluateRelevance(JSON.stringify(chatLogs));
  console.log(
    "summarizeAndEvaluateRelevanceResult",
    summarizeAndEvaluateRelevanceResult
  );
  //用户最后一句话不是问题，或和主题不相关，但AI给出结果
  if (summarizeAndEvaluateRelevanceResult.answer) {
    await createChatLogByUserId(
      userId,
      summarizeAndEvaluateRelevanceResult.answer
    );
    props.setGlobalData({
      ...props.globalData,
      inputStatus: inputStatusEnum.idle,
    });
    return;
  }
  ////用户最后一句话不是问题，或和主题不相关，但AI没有给出结果
  if (
    summarizeAndEvaluateRelevanceResult.isIssue === false ||
    summarizeAndEvaluateRelevanceResult.relevant === false
  ) {
    await createLastChatLogAndQRcodeByUserId(userId, errorMessageByIsIssue);
    return;
  }
  //做相似性搜索
  const newQuestion = summarizeAndEvaluateRelevanceResult.summaryIssue;
  const relatedReferences = await getSimilarMaterials(newQuestion);
  if (!relatedReferences.length) {
    await recommendColleaguesToUserFromAI(JSON.stringify(chatLogs), props);
    return;
  }
  provideNormalResponseFromAI(
    newQuestion,
    JSON.stringify(relatedReferences),
    props
  );
}
