
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
  input_status: string;
  user_id: bigint;
  assistant_answer:string;
}
