const Voting = artifacts.require('./Voting.sol');
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require ('chai');

contract("TestVoting", accounts => {
    const admin = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const nonVoter = accounts[4];

    describe("Tests : access control", function() {
        let votingInstance;

        this.beforeEach(async function () {
            votingInstance = await Voting.new({from: admin});
        });

        it("... should only allow admin to add voters", async () => {
            await expectRevert(votingInstance.addVoter.call(voter2, {from: voter1}), "Ownable: caller is not the owner");
        });

        it("... should only allow admin to change workflow statuses", async () => {
            await expectRevert(votingInstance.startProposalsRegistering.call({from: voter1}), "Ownable: caller is not the owner");
            // Fast forward
            await votingInstance.startProposalsRegistering({from: admin});
            await expectRevert(votingInstance.endProposalsRegistering.call({from: voter1}), "Ownable: caller is not the owner");
            // Fast forward
            await votingInstance.endProposalsRegistering({from: admin});
            await expectRevert(votingInstance.startVotingSession.call({from: voter1}), "Ownable: caller is not the owner");
            // Fast forward
            await votingInstance.startVotingSession({from: admin});
            await expectRevert(votingInstance.endVotingSession.call({from: voter1}), "Ownable: caller is not the owner");
            // Fast forward
            await votingInstance.endVotingSession({from: admin});
            await expectRevert(votingInstance.tallyVotes.call({from: voter1}), "Ownable: caller is not the owner");
        });

        it("... should only allow registered voters to register proposals", async () => {
            // Fast forwarding to register proposal step
            await votingInstance.startProposalsRegistering({from: admin});
            // Voter 1 is not registered
            await expectRevert(votingInstance.addProposal.call("Voter1 proposal", {from: voter1}), "You're not a voter");
        });

        it("... should only allow registered voters to vote for proposals", async () => {
            // Fast forwarding to register proposal step
            await votingInstance.addVoter(voter2, {from: admin});
            await votingInstance.startProposalsRegistering({from: admin});
            await votingInstance.addProposal("Voter2 Proposal", {from: voter2});
            await votingInstance.endProposalsRegistering({from: admin});
            await votingInstance.startVotingSession({from: admin});
            // Voter 1 is not registered
            await expectRevert(votingInstance.setVote.call(0, {from: voter1}), "You're not a voter");
        });

        it("... should forbid registered voters to vote twice", async () => {
            // Fast forwarding to register proposal step
            await votingInstance.addVoter(voter1, {from: admin});
            await votingInstance.addVoter(voter2, {from: admin});
            await votingInstance.startProposalsRegistering({from: admin});
            await votingInstance.addProposal("Voter1 Proposal", {from: voter1});
            await votingInstance.addProposal("Voter2 Proposal", {from: voter2});
            await votingInstance.endProposalsRegistering({from: admin});
            await votingInstance.startVotingSession({from: admin});
            await votingInstance.setVote(0, {from: voter1});
            // Voter 1 is not registered
            await expectRevert(votingInstance.setVote.call(1, {from: voter1}), "You have already voted");
        });
    });

    // TODO: add addVoters, addProposals and setVotes
    describe("Tests : workflow cycling", function() {
        let votingInstance;

        before(async function () {
            votingInstance = await Voting.new({from: admin});
        });

        context('Workflow Status : registering Voters', function() {
            it("... should start at the registering voters state", async () => {
                const currentStatus = await votingInstance.workflowStatus.call();
                expect(new BN(currentStatus)).to.be.bignumber.equal(new BN(0));
            });

            it("... should forbid to switch to registering proposal ended state", async () => {
                await expectRevert(votingInstance.endProposalsRegistering.call({from: admin}), "Registering proposals havent started yet");
            });

            it("... should forbid to switch to voting session started state", async () => {
                await expectRevert(votingInstance.startVotingSession.call({from: admin}), "Registering proposals phase is not finished");
            });

            it("... should forbid to switch to voting session ended state", async () => {
                await expectRevert(votingInstance.endVotingSession.call({from: admin}), "Voting session havent started yet");
            });

            it("... should forbid to switch to votes tallied state", async () => {
                await expectRevert(votingInstance.tallyVotes.call({from: admin}), "Current status is not voting session ended");
            });

            it("... should allow to switch to proposal registering started state", async () => {
                const receipt = await votingInstance.startProposalsRegistering({from: admin});
                expectEvent(receipt, 'WorkflowStatusChange', {
                    previousStatus: new BN(0),
                    newStatus: new BN(1)
                });
            });
        });

        context('Workflow Status : registering proposals started', function() {
            it("... should be at the registering proposals started state", async () => {
                const currentStatus = await votingInstance.workflowStatus.call();
                expect(new BN(currentStatus)).to.be.bignumber.equal(new BN(1));
            });

            it("... should forbid to switch to voting session started state", async () => {
                await expectRevert(votingInstance.startVotingSession.call(), "Registering proposals phase is not finished");
            });

            it("... should forbid to switch to voting session ended state", async () => {
                await expectRevert(votingInstance.endVotingSession.call(), "Voting session havent started yet");
            });

            it("... should forbid to switch to votes tallied state", async () => {
                await expectRevert(votingInstance.tallyVotes.call(), "Current status is not voting session ended");
            });

            it("... should allow to switch to proposal registering ended state", async () => {
                const receipt = await votingInstance.endProposalsRegistering({from: admin});
                expectEvent(receipt, 'WorkflowStatusChange', {
                    previousStatus: new BN(1),
                    newStatus: new BN(2)
                });
            });
        });

        context('Workflow Status : registering proposals ended', function() {
            it("... should be at the registering proposals ended state", async () => {
                const currentStatus = await votingInstance.workflowStatus.call();
                expect(new BN(currentStatus)).to.be.bignumber.equal(new BN(2));
            });

            it("... should forbid to switch to registering proposal started state", async () => {
                await expectRevert(votingInstance.startProposalsRegistering.call({from: admin}), 'Registering proposals cant be started now');
            });

            it("... should forbid to switch to voting session ended state", async () => {
                await expectRevert(votingInstance.endVotingSession.call(), "Voting session havent started yet");
            });

            it("... should forbid to switch to votes tallied state", async () => {
                await expectRevert(votingInstance.tallyVotes.call(), "Current status is not voting session ended");
            });

            it("... should allow to switch to voting session started state", async () => {
                const receipt = await votingInstance.startVotingSession({from: admin});
                expectEvent(receipt, 'WorkflowStatusChange', {
                    previousStatus: new BN(2),
                    newStatus: new BN(3)
                });
            });
        });

        context('Workflow Status : voting session started', function() {
            it("... should be at the voting session started state", async () => {
                const currentStatus = await votingInstance.workflowStatus.call();
                expect(new BN(currentStatus)).to.be.bignumber.equal(new BN(3));
            });

            it("... should forbid to switch to registering proposal started state", async () => {
                await expectRevert(votingInstance.startProposalsRegistering.call({from: admin}), 'Registering proposals cant be started now');
            });

            it("... should forbid to switch to registering proposal ended state", async () => {
                await expectRevert(votingInstance.endProposalsRegistering.call({from: admin}), "Registering proposals havent started yet");
            });

            it("... should forbid to switch to votes tallied state", async () => {
                await expectRevert(votingInstance.tallyVotes.call(), "Current status is not voting session ended");
            });

            it("... should allow to switch to voting session ended state", async () => {
                const receipt = await votingInstance.endVotingSession({from: admin});
                expectEvent(receipt, 'WorkflowStatusChange', {
                    previousStatus: new BN(3),
                    newStatus: new BN(4)
                });
            });
        });

        context('Workflow Status : voting session ended', function() {
            it("... should be at the voting session ended state", async () => {
                const currentStatus = await votingInstance.workflowStatus.call();
                expect(new BN(currentStatus)).to.be.bignumber.equal(new BN(4));
            });

            it("... should forbid to switch to registering proposal started state", async () => {
                await expectRevert(votingInstance.startProposalsRegistering.call({from: admin}), 'Registering proposals cant be started now');
            });

            it("... should forbid to switch to registering proposal ended state", async () => {
                await expectRevert(votingInstance.endProposalsRegistering.call({from: admin}), "Registering proposals havent started yet");
            });

            it("... should forbid to switch to voting session started state", async () => {
                await expectRevert(votingInstance.startVotingSession.call(), "Registering proposals phase is not finished");
            });

            it("... should allow to switch to votes tallied state", async () => {
                const receipt = await votingInstance.tallyVotes({from: admin});
                expectEvent(receipt, 'WorkflowStatusChange', {
                    previousStatus: new BN(4),
                    newStatus: new BN(5)
                });
            });
        });

        context('Workflow Status : votes tallied', function() {
            it("... should be at the votes tallied state", async () => {
                const currentStatus = await votingInstance.workflowStatus.call();
                expect(new BN(currentStatus)).to.be.bignumber.equal(new BN(5));
            });

            it("... should forbid to switch to registering proposal started state", async () => {
                await expectRevert(votingInstance.startProposalsRegistering.call({from: admin}), 'Registering proposals cant be started now');
            });

            it("... should forbid to switch to registering proposal ended state", async () => {
                await expectRevert(votingInstance.endProposalsRegistering.call({from: admin}), "Registering proposals havent started yet");
            });

            it("... should forbid to switch to voting session started state", async () => {
                await expectRevert(votingInstance.startVotingSession.call(), "Registering proposals phase is not finished");
            });

            it("... should forbid to switch to voting session ended state", async () => {
                await expectRevert(votingInstance.endVotingSession.call(), "Voting session havent started yet");
            });
        });


    });

    describe('Tests: voters and vote', function () {
        let votingInstance;

        before(async function () {
            votingInstance = await Voting.new({from: admin});
        });

        it("... should register a new voter", async () => {
            const receipt = await votingInstance.addVoter(voter1, {from: admin});
            expectEvent(receipt, "VoterRegistered", {
                voterAddress: voter1
            });
        });
    });
});