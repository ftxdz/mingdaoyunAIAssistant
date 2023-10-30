import { runGql } from "./runGql";

const gql: string = `mutation insertChatLog($userId: bigint!, $chatContent: String) {
    insert_chat_log_one(
      object: { role: "assistant", user_user: $userId, content: $chatContent }
    ) {
      id
    }
  }`;

export async function createChatLogByUserId(
  userId: bigint,
  chatContent: string
) {
  const response = await runGql(gql, {
    userId: userId,
    chatContent: chatContent,
  });
  const insertUserData = response.result.data.insert_chat_log_one;
  if (insertUserData) {
    return insertUserData.id;
  }
  throw new Error(response.result.errors);
}
