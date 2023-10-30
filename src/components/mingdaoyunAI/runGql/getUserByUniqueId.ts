import { runGql } from "./runGql";
interface chatLog {
  role: string;
  content: string;
}
const gql = `query user($uuid:String){
    user(where: {uuid:{_eq:$uuid}}) {
      id
      uuid
    }
  }`;
export async function getUserByUniqueId(uuid: string) {
  const response = await runGql(gql, { uuid: uuid });
  const userMessage = response.result.data.user;
  if (userMessage) {
    return userMessage;
  }
  throw new Error(response.result.errors);
}
