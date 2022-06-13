# Project : Voting System

## Limitation
There is only one active voting session at any given time. 
This limitation is set because the given events does not integrate a session number.
With this constraint, these events would become meaningless with multiple active sessions.
I decided to limit the number of active session to one, to keep them useful.

## Getters
The only public param I have for my contract is the sessionNumber.
I decided to create custom specific getters for voters and proposals since user can read details about previous sessions, and I did not want my structs to be public since I did not want getters for everything.
Getters I wrote :
- getSessionDetails
- getVoter
- getNumberOfProposals
- getProposal
- getWinner
- getWinnerForSession

Getters I did not write but easy to add :
- getVoterForSession
- getNumberOfProposalForSession
- getProposalForSession
- getNumberOfVoters

The getters I did not write are of low interest in my opinion. Thus, I decided to not implement them.

The "getNumberOfVoters" is not interesting since vote works following the simple majority rule. 
As such we don't need to watch for the number of voters.
If we had to change the voting type we would need to count the voters that did not vote. 

## Case of the first session
The first session is created in the constructor and requires the admin to deploy the contract with the name and description for the first session.
The first emit of the WorkflowStatusChange will say that the previous Workflow status is "RegisteringVoters": this is a limitation of the WorkflowStatus struct that doesn't implement a "Contract created" item.

## Admin can be Voter
The admin is not necessarily a voter but can register itself as a voter.
Admins that are not voters can not register proposals and can not vote for proposals.
I believe this is more logical: tech admin can handle the tedious technical process, yet he may not be allowed to take part in business related votes.

## List of Voters
There is no array of voters that could allow quick iteration through addresses. I decided that users will require the wallet address of a Voter to check its Vote.
The Voter is accessible, though. Since there is an emit of the whitelisted voter, I believe that a front end could listen to the events to keep track of the voters address and propose a voter list without needing more gas when admin whitelist a Voter.
Each session have its own voters list, since not everyone would be allowed to vote for every decision.
Example : If a voting session is about the daily scrum meeting accross the tech department, financials may not be involved.