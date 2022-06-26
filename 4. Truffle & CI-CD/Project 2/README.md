# Project 2 - Créer une couverture de test pour le contrat de vote

## Informations générales



## Liste des tests
Les tests sont répartis en différents scénarios.
Ces scénarios sont ordonnés dans l'ordre qui me semblait le plus pertinent :

1. Access Control : vérification des droits utilisateurs
2. Workflow Cycling : garantit que le workflow suit un ordre précis
3. Voting : Test les fonctionnalités de vote
4. Misc : Tests particuliers

### Access Control - 5 tests
Ce scénario nous permet de tester les droits des utilisateurs au sein d'une session de vote.

|Context     |Title                                                    |Tests                           |Expect/ExpectRevert/ExpectEvent|
|------------|---------------------------------------------------------|--------------------------------|-------------------------------|
|     -      |should only allow admin to add voters                    |addVoter()                      |expectRevert                   |
|     -      |should only allow admin to change workflow statuses      |startProposalsRegistering(), endProposalsRegistering(), startVotingSession(),                                                                       endVotingSession(), tallyVotes()|expectRevert                   |
|     -      |should only allow registered voters to register proposals|addProposal()                   |expectRevert                   |
|     -      |should only allow registered voters to vote for proposals|setVote()                       |expectRevert                   |
|     -      |should forbid registered voters to vote twice            |setVote()                       |expectRevert                   |

---

### Workflow cycling - 46 tests
Lors de ce scénario, nous passons sur tous les états du workflow pour vérifier que le séquencement des étapes est bien respecté.

Le découpage en contexte est fait sur les différents états. 

Chaque contexte commence par la vérification de l'état actuel, et se termine par le passage à l'état suivant.

Le passage à l'étape suivant est testé sur l'émission de l'évènement "WorkflowStatusChange" et est validé au début du contexte suivant par la vérification du status actuel.

|Context                               |Title                                                        |Tests                     |Expect/ExpectRevert/ExpectEvent|
|--------------------------------------|-------------------------------------------------------------|--------------------------|-------------------------------|
|Status : registering Voters           |should start at the registering voters state                 |workflowStatus            |expect                         |
|Status : registering Voters           |should forbid to add proposals                               |addProposal()             |expectRevert                   |
|Status : registering Voters           |should forbid to switch to registering proposal ended state  |endRegisteringProposals() |expectRevert                   |
|Status : registering Voters           |should forbid to switch to voting session started state      |startVotingSession()      |expectRevert                   |
|Status : registering Voters           |should forbid to vote for a proposal                         |setVote()                 |expectRevert                   |
|Status : registering Voters           |should forbid to switch to voting session ended state        |endVotingSession()        |expectRevert                   |
|Status : registering Voters           |should forbid to switch to votes tallied state               |tallyVotes()              |expectRevert                   |
|Status : registering Voters           |should allow to switch to proposal registering started state |startProposalRegistering()|expectEvent                    |
|Status : registering proposals started|should be at the registering proposals started state         |workflowStatus            |expect                         |
|Status : registering proposals started|should forbid to add voters                                  |addVoter()                |expectRevert                   |
|Status : registering proposals started|should forbid to switch to voting session started state      |startVotingSession()      |expectRevert                   |
|Status : registering proposals started|should forbid to vote for a proposal                         |setVote()                 |expectRevert                   |
|Status : registering proposals started|should forbid to switch to voting session ended state        |endVotingSession()        |expectRevert                   |
|Status : registering proposals started|should forbid to switch to votes tallied state               |tallyVotes()              |expectRevert                   |
|Status : registering proposals started|should allow to switch to proposal registering ended state   |endRegisteringProposals() |expectEvent                    |
|Status : registering proposals ended  |should be at the registering proposals ended state           |workflowStatus            |expect                         |
|Status : registering proposals ended  |should forbid to add voters                                  |addVoter()                |expectRevert                   |
|Status : registering proposals ended  |should forbid to switch to registering proposal started state|startProposalRegistering()|expectRevert                   |
|Status : registering proposals ended  |should forbid to add proposals                               |addProposal()             |expectRevert                   |
|Status : registering proposals ended  |should forbid to vote for a proposal                         |setVote()                 |expectRevert                   |
|Status : registering proposals ended  |should forbid to switch to voting session ended state        |endVotingSession()        |expectRevert                   |
|Status : registering proposals ended  |should forbid to switch to votes tallied state               |tallyVotes()              |expectRevert                   |
|Status : registering proposals ended  |should allow to switch to voting session started state       |startVotingSession()      |expectEvent                    |
|Status : voting session started       |should be at the voting session started state                |workflowStatus            |expect                         |
|Status : voting session started       |should forbid to add voters                                  |addVoter()                |expectRevert                   |
|Status : voting session started       |should forbid to switch to registering proposal started state|startProposalRegistering()|expectRevert                   |
|Status : voting session started       |should forbid to add proposals                               |addProposal()             |expectRevert                   |
|Status : voting session started       |should forbid to switch to registering proposal ended state  |endRegisteringProposals() |expectRevert                   |
|Status : voting session started       |should forbid to switch to votes tallied state               |tallyVotes()              |expectRevert                   |
|Status : voting session started       |should allow to switch to voting session ended state         |endVotingSession()        |expectEvent                    |
|Status : voting session ended         |should be at the voting session ended state                  |workflowStatus            |expect                         |
|Status : voting session ended         |should forbid to add voters                                  |addVoter()                |expectRevert                   |
|Status : voting session ended         |should forbid to switch to registering proposal started state|startProposalRegistering()|expectRevert                   |
|Status : voting session ended         |should forbid to add proposals                               |addProposal()             |expectRevert                   |
|Status : voting session ended         |should forbid to switch to registering proposal ended state  |endRegisteringProposals() |expectRevert                   |
|Status : voting session ended         |should forbid to switch to voting session started state      |startVotingSession()      |expectRevert                   |
|Status : voting session ended         |should forbid to vote for a proposal                         |setVote()                 |expectRevert                   |
|Status : voting session ended         |should allow to switch to votes tallied state                |tallyVotes()              |expectEvent                    |
|Status : votes tallied                |should be at the votes tallied state                         |workflowStatus            |expect                         |
|Status : votes tallied                |should forbid to add voters                                  |addVoter()                |expectRevert                   |
|Status : votes tallied                |should forbid to switch to registering proposal started state|startProposalRegistering()|expectRevert                   |
|Status : votes tallied                |should forbid to add proposals                               |addProposal()             |expectRevert                   |
|Status : votes tallied                |should forbid to switch to registering proposal ended state  |endRegisteringProposals() |expectRevert                   |
|Status : votes tallied                |should forbid to switch to voting session started state      |startVotingSession()      |expectRevert                   |
|Status : votes tallied                |should forbid to vote for a proposal                         |setVote()                 |expectRevert                   |
|Status : votes tallied                |should forbid to switch to voting session ended state        |endVotingSession()        |expectRevert                   |
---

### Voting
