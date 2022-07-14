import { EthProvider, useEth } from "./contexts/EthContext";
import Whitelist from "./components/Whitelist";
import "./App.css";
import Proposals from "./components/Proposals";
import Workflow from "./components/Workflow";
import { useState } from "react";

function App() {
  const [workflowState, setWorkflowState] = useState(0);

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <Workflow currentState={workflowState} changeState={setWorkflowState} />
          <hr />
          <Whitelist />
          <hr />
          <Proposals />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
