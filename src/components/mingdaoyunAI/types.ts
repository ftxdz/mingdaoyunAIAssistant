
export interface chatProps {
  globalData: Record<string, any>;
  setGlobalData: (data: Record<string, any>) => void;
}
/**
 * globalData
 * 
 * inputStatus
 * assistantContent
 */
export interface chatGlobalData {
  isLoggedIn: string;
  inputStatus: string;
  userId: bigint;
  assistantAnswer:string;
}
