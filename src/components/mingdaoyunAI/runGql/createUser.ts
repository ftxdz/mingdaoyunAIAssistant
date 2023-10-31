import { v4 as uuidv4 } from "uuid";
import { runGql } from "./runGql";
const greetingMessage = "Hello 同学～  欢迎了解Zion，很高兴我们能在一年一度的伙伴大会相见，如果你对Zion无代码开发工具以及我们和明道云的故事感兴趣，可以跟我聊聊哦";
const gql: string = `mutation insertUser($uuid: String!, $greetingMessage: String) {
    insert_user_one(
      object: {
        uuid: $uuid
        chat_logs: { data: [{ role: "assistant", content: $greetingMessage }] }
      }
    ) {
      id
    }
  }`;

export async function createUserAndFirstChatByUuid() {
  console.log('createUserAndFirstChatByUuid');
  while (true) {
    const uniqueId: string = uuidv4();
    const response = await runGql(gql, {
      uuid: uniqueId,
      greetingMessage: greetingMessage,
    });
    const insertUserData = response.result.data.insert_user_one;
    if (insertUserData) {
      return {userId:insertUserData.id,uniqueId:uniqueId};
    }
    throw new Error(response.result.errors);
  }
}