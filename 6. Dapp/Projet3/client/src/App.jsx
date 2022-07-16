import { EthProvider, useEth } from "./contexts/EthContext";
import Whitelist from "./components/Whitelist";
import "./App.css";
import Proposals from "./components/Proposals";
import Workflow from "./components/Workflow";
import { useState } from "react";
import Header from "./components/Header";
import AppBtn from "./components/AppBtn";
import useModal from "./components/hook/useModal";
import Modal from "./components/modal";

function App() {
  const [workflowState, setWorkflowState] = useState(0);
  const [voterList, setVoterList] = useState([]);
  const {isShowing: isVoterListVisible, toggle: toggleVoterList} = useModal();
  const {isShowing: areProposalsVisible, toggle: toggleProposals} = useModal();
  const {isShowing: isVotingVisible, toggle: toggleVoting} = useModal();
  const {isShowing: isResultVisible, toggle: toggleResult} = useModal();
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
            <AppBtn type="voters" show={toggleVoterList}/>
            <AppBtn type="proposals" show={toggleProposals}/>
            <AppBtn type="voting" show={toggleVoting}/>
            <AppBtn type="result" show={toggleResult}/>

            <Modal isShowing={isVoterListVisible} hide={toggleVoterList} title="Liste des votants">
              <Whitelist currentState={workflowState} voterList={voterList} updateVoterList={updateVoterList}/>
            </Modal>
            <Modal isShowing={areProposalsVisible} hide={toggleProposals} title="Liste des propositions">
              <Proposals currentState={workflowState} voterList={voterList}/>
            </Modal>
            <Modal isShowing={isVotingVisible} hide={toggleVoting} title="Voter"/>
            <Modal isShowing={isResultVisible} hide={toggleResult} title="Resultat"/>
          </div>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
