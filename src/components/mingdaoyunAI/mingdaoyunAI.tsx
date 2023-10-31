//代码
import { useEffect } from "react";
import { createUserAndFirstChatByUuid } from "./runGql/createUser";
import { getUserByUniqueId } from "./runGql/getUserByUniqueId";
import { chatCompletion } from "./chatCompletion/chatCompletion";
import { chatProps, chatGlobalData } from "./types";
import { inputStatusEnum } from "./enums";

export function MingdaoyunAI(props: chatProps) {
  console.log("组件接收参数", props);
  const globalData = props.globalData as chatGlobalData;
  let getCookieStart = true;
  useEffect(() => {
    // 异步函数
    const isUserLoggedIn = async () => {
      console.log("getCookieStart", getCookieStart);
      if (!getCookieStart) {
        console.log("判断getCookieStart", "结束");
        return;
      }
      console.log("判断getCookieStart", "kaishi");
      getCookieStart = false;
      const uuid = getCookie("user");
      console.log("uuid", uuid);
      if (uuid) {
        const userMessages = await getUserByUniqueId(uuid);
        console.log("userMessages", userMessages);
        if (userMessages.length) {
          props.setGlobalData({
            ...props.globalData,
            userId: userMessages[0].id,
          });
        } else {
          createUser();
        }
      } else {
        createUser();
      }
    };
    isUserLoggedIn();
    function setCookie(name: string, value: string): void {
      document.cookie = name + "=" + value + "; path=/";
    }
    function getCookie(name: string): string | null {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    async function createUser() {
      console.log("创建用户");
      const { userId, uniqueId } = await createUserAndFirstChatByUuid();
      console.log("执行结束");
      props.setGlobalData({
        ...props.globalData,
        userId: userId,
      });
      setCookie("user", uniqueId);
    }
  }, []);

  let chatStart = true;

  useEffect(() => {
    if (chatStart) {
      chatStart = false;
      console.log("开始chatCompletion", props);
      if (!globalData.user_id) return;
      const inputStatus = props.globalData.inputStatus;
      console.log(inputStatus);
      if (inputStatus === inputStatusEnum.start) {
        console.log("kaishi");
        props.setGlobalData({
          ...props.globalData,
          inputStatus: inputStatusEnum.inProgress,
        });
        chatCompletion(globalData.user_id, props);
      }
    }
  }, [props.globalData.inputStatus]);

  return <div>qwert</div>;
}
