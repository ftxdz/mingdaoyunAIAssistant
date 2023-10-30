import { ZhipuAi } from "./components/mingdaoyunAI/ZhipuAi";
import { MingdaoyunAI } from "./components/mingdaoyunAI";
import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import { useState } from "react";

function App() {
  const [globalData, setGlobalData] = useState({});
/**
 * {
    inputStatus: "开始",
    userId: 1,
    assistantAnswer:"",
  }
 */
  return (
    <BrowserRouter>
      <div style={{ height: "60px", width: "60px" }}>
        <MingdaoyunAI globalData={globalData} setGlobalData={setGlobalData} />
      </div>
      <div style={{ height: "60px", width: "60px" }}>
        <>{JSON.stringify(globalData)}</>
      </div>
    </BrowserRouter>
  );
}

export default App;
