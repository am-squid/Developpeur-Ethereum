import { EthProvider, useEth } from "./contexts/EthContext";
import Whitelist from "./components/Whitelist";
import "./App.css";
import Proposals from "./components/Proposals";
import Workflow from "./components/Workflow";
import { useState } from "react";
import Header from "./components/Header";
import AppBtn from "./components/AppBtn";

function App() {
  const [workflowState, setWorkflowState] = useState(0);
  const [voterList, setVoterList] = useState([]);
  // const []

  // Update voterList checks if there is a change in the list before updating the state.
  const updateVoterList = (list) => {
    if(list.length > voterList.length) {
      console.log("New voter : "+list[list.length-1])
      console.log(voterList);
      setVoterList(list);
    }
  }

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <Header />
          <Workflow currentState={workflowState} changeState={setWorkflowState} />
          <div className="btnWrapper">
            <AppBtn type="voters" />
            <AppBtn type="proposals" />
            <AppBtn type="voting" />
            <AppBtn type="result" />

            
            <hr />
            <Whitelist currentState={workflowState} voterList={voterList} updateVoterList={updateVoterList}/>
            <hr />
            <Proposals currentState={workflowState} voterList={voterList}/>
          </div>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
