;; QuestPulse Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-quest (err u101))
(define-constant err-already-completed (err u102))
(define-constant err-deadline-passed (err u103))

;; Data Variables
(define-data-var quest-nonce uint u0)

;; Quest Data Structure
(define-map quests uint {
    creator: principal,
    title: (string-ascii 100),
    deadline: uint,
    reward: uint,
    completed: bool
})

;; Quest Completion Records
(define-map completions {quest-id: uint, user: principal} {
    completed-at: uint,
    reward-claimed: bool
})

;; Public Functions
(define-public (create-quest (title (string-ascii 100)) (duration uint) (reward uint))
    (let
        ((quest-id (+ (var-get quest-nonce) u1)))
        (map-set quests quest-id {
            creator: tx-sender,
            title: title,
            deadline: (+ block-height duration),
            reward: reward,
            completed: false
        })
        (var-set quest-nonce quest-id)
        (ok quest-id)
    )
)

(define-public (complete-quest (quest-id uint))
    (let ((quest (unwrap! (map-get? quests quest-id) err-invalid-quest)))
        (asserts! (not (get completed quest)) err-already-completed)
        (asserts! (< block-height (get deadline quest)) err-deadline-passed)
        
        (map-set completions {quest-id: quest-id, user: tx-sender} {
            completed-at: block-height,
            reward-claimed: false
        })
        
        (map-set quests quest-id (merge quest {completed: true}))
        (ok true)
    )
)

(define-public (claim-reward (quest-id uint))
    (let 
        ((quest (unwrap! (map-get? quests quest-id) err-invalid-quest))
         (completion (unwrap! (map-get? completions {quest-id: quest-id, user: tx-sender}) err-invalid-quest)))
        (asserts! (get completed quest) err-invalid-quest)
        (asserts! (not (get reward-claimed completion)) err-already-completed)
        
        (map-set completions {quest-id: quest-id, user: tx-sender} 
            (merge completion {reward-claimed: true}))
        (ok true)
    )
)

;; Read Only Functions
(define-read-only (get-quest-details (quest-id uint))
    (ok (map-get? quests quest-id))
)

(define-read-only (get-completion-status (quest-id uint) (user principal))
    (ok (map-get? completions {quest-id: quest-id, user: user}))
)
