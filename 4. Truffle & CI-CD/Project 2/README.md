# Project 2 - Créer une couverture de test pour le contrat de vote

## Informations générales
### Utilisation de contract()
J'utilise dans mes test la fonction contract() à la place de la fonction describe().
- https://trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript/#use-contract-instead-of-describe

## Liste des tests
Les tests sont répartis en différents scénarios.

### Workflow cycling - 31 tests
Lors de ce scénario, nous passons sur tous les états du workflow pour vérifier que le séquencement des étapes est bien respecté.
Le découpage en contexte est fait sur les différents états. 
Chaque contexte commence par la vérification de l'état actuel, et se termine par le passage à l'état suivant.
Le passage à l'étape suivant est testé sur l'émission de l'évènement "WorkflowStatusChange", et est validé au début du contexte suivant par la vérification du status actuel.
