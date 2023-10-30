import { runGql } from "./runGql";
interface chatLog {
  role: string;
  content: string;
}
const gql = `query userMessage($userId: bigint!) {
  userMessage: user_by_pk(id: $userId) {
    messages: chat_logs {
      role
      content
    }
  }
}`;
export default async function getUserChatLogsFromDB(userId: bigint) {
  const response = await runGql(gql, { userId: userId });
  const userMessage = response.result.data.userMessage;
  if (userMessage) {
    return userMessage.messages as chatLog[];
  }
  throw new Error(response.result.errors);
}
