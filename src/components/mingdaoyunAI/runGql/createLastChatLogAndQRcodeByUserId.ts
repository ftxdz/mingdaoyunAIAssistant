import { runGql } from "./runGql";

const gql: string = `mutation insertChatLogs($userId: bigint!, $chatContent: String) {
    insert_chat_log(
      objects: [
        { role: "assistant", user_user: $userId, ud_isqrcode_8d9876: true }
        { role: "assistant", user_user: $userId, content: $chatContent }
      ]
    ) {
      affected_rows
    }
  }`;

export async function createLastChatLogAndQRcodeByUserId(
  userId: bigint,
  chatContent: string
) {
  const response = await runGql(gql, {
    uuuserIdid: userId,
    chatContent: chatContent,
  });
  const insertUserData = response.result.data.insert_chat_log;
  if (insertUserData) {
    return insertUserData.affected_rows;
  }
  throw new Error(response.result.errors);
}
