# QuestPulse

A decentralized challenge app for setting and achieving life goals with rewards for completion.

## Features
- Create personalized quests/challenges
- Set quest rewards and completion criteria  
- Complete quests to earn rewards
- View quest history and achievements
- Verification of quest completion

## Setup and Installation
1. Clone the repository
2. Install Clarinet
3. Run `clarinet check` to verify contracts
4. Run `clarinet test` to run test suite

## Usage Examples
```clarity
;; Create a new quest
(contract-call? .quest-pulse create-quest "Get in shape" u30 u100)

;; Complete a quest
(contract-call? .quest-pulse complete-quest u1)

;; View quest details
(contract-call? .quest-pulse get-quest-details u1)
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment
