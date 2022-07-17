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
import EventWatcher from "./components/EventWatcher";

function App() {
  const [workflowState, setWorkflowState] = useState(0);
  const [voterList, setVoterList] = useState([]);
  const [proposalList, setProposalList] = useState([]);
  const {isShowing: isVoterListVisible, toggle: toggleVoterList} = useModal();
  const {isShowing: areProposalsVisible, toggle: toggleProposals} = useModal();
  const {isShowing: isVotingVisible, toggle: toggleVoting} = useModal();
  const {isShowing: isResultVisible, toggle: toggleResult} = useModal();
 
  const addProposalToList = (proposal) => {
    // Checking if the proposal is new before storing it
    let isNew = true;
    proposalList.map((storedProposal) => {
      if(proposal.key === storedProposal.key) {
        isNew = false;
      }
    });
    // The proposal is a new one, we store it
    if(isNew) {
      let tempList = proposalList;
      tempList.push(proposal);
      setProposalList(tempList);
    }
    
  }

  return (
    <EthProvider>
      <EventWatcher 
        currentState={workflowState}
        refreshVoterList={setVoterList}
        addToProposalList={addProposalToList}
        changeState={setWorkflowState}
      />
      <div id="App" >
        <div className="container">
          <Header />
          <Workflow currentState={workflowState}/>
          <div className="btnWrapper">
            <AppBtn type="voters" show={toggleVoterList}/>
            <AppBtn type="proposals" show={toggleProposals}/>
            <AppBtn type="voting" show={toggleVoting}/>
            <AppBtn type="result" show={toggleResult}/>

            <Modal isShowing={isVoterListVisible} hide={toggleVoterList} title="Liste des votants">
              <Whitelist currentState={workflowState} voters={voterList}/>
            </Modal>
            <Modal isShowing={areProposalsVisible} hide={toggleProposals} title="Liste des propositions">
              <Proposals currentState={workflowState} proposals={proposalList}/>
            </Modal>
            <Modal isShowing={isVotingVisible} hide={toggleVoting} title="Voter"/>
            <Modal isShowing={isResultVisible} hide={toggleResult} title="Resultat"/>

            <button onClick={() => {console.log(workflowState)}}>Test</button>
          </div>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
