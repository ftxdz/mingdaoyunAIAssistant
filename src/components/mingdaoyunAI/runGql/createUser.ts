import { v4 as uuidv4 } from "uuid";
import { runGql } from "./runGql";
const greetingMessage = "你好呀";
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