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
import Vote from "./components/Vote";
import Result from "./components/Result";

function App() {
  const [workflowState, setWorkflowState] = useState(0);
  const [voterList, setVoterList] = useState([]);
  const [proposalList, setProposalList] = useState([]);
  const [voteList, setVoteList] = useState([]);
  const {isShowing: isVoterListVisible, toggle: toggleVoterList} = useModal();
  const {isShowing: areProposalsVisible, toggle: toggleProposals} = useModal();
  const {isShowing: isVotingVisible, toggle: toggleVoting} = useModal();
  const {isShowing: isResultVisible, toggle: toggleResult} = useModal();
 
  const addNewVoter = (voter) => {
    if (voterList.indexOf(voter) > -1) {
      return;
    }
    // Adding the new voter to the list
    let tempList = voterList;
    voterList.push(voter);
    setVoterList(tempList);
  }

  const addProposalToList = (proposal) => {
    // Checking if the proposal is new before storing it
    let isNew = true;
    proposalList.map((storedProposal) => {
      if(proposal.id === storedProposal.id) {
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

  const addVoteToList = (vote, liveCount) => {
    // Checking if the vote is new before storing it
    let isNew = true;
    voteList.map((storedVote) => {
      if(vote.address === storedVote.address) {
        isNew = false;
      }
    });
    // If the vote is a new one, we store it
    if(!isNew){
      return;
    }
    let tempList = voteList;
    tempList.push(vote);
    setVoteList(tempList);
    // Updating the voteCount for the proposal if live counting is activated
    if(!liveCount){
      return;
    }
    tempList = proposalList;
    tempList[vote.proposalId].voteCount++;
    setProposalList(proposalList);
  }

  return (
    <EthProvider>
      <EventWatcher 
        currentState={workflowState}
        changeState={setWorkflowState}
        addVoter={addNewVoter}
        addToProposalList={addProposalToList}
        addToVoteList={addVoteToList}
      />
      <div id="App" >
        <div className="container">
          <Header />
          <Workflow currentState={workflowState}/>
          <div className="btnWrapper">
            <AppBtn type="voters" show={toggleVoterList} currentState={workflowState}/>
            <AppBtn type="proposals" show={toggleProposals} currentState={workflowState}/>
            <AppBtn type="voting" show={toggleVoting} currentState={workflowState}/>
            <AppBtn type="result" show={toggleResult} currentState={workflowState}/>

            <Modal isShowing={isVoterListVisible} hide={toggleVoterList} title="Liste des votants">
              <Whitelist currentState={workflowState} voters={voterList}/>
            </Modal>
            <Modal isShowing={areProposalsVisible} hide={toggleProposals} title="Liste des propositions">
              <Proposals currentState={workflowState} proposals={proposalList}/>
            </Modal>
            <Modal isShowing={isVotingVisible} hide={toggleVoting} title="Voter">
              <Vote currentState={workflowState} votes={voteList}/>
            </Modal>
            <Modal isShowing={isResultVisible} hide={toggleResult} title="Resultat">
              <Result currentState={workflowState} proposals={proposalList} />
            </Modal>
            <button onClick={() => {console.log(proposalList)}}>Test</button>
          </div>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
