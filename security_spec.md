# Zero-Trust Database Security Specification (NEIMS Unit)

This security specification enforces absolute data integrity, identifier safety, and multi-tenant isolation across our permanent Firestore structures.

## 1. Data Invariants

1. **User Profiles:**
   * A user profile can only be created and accessed by the authenticated user matching `request.auth.uid`.
   * Unauthenticated users or other authenticated users are strictly forbidden from reading or writing user profile info.
   * Profile `email` and `userId` fields are immutable once initialized.

2. **Custom Signals:**
   * Any authenticated, verified analyst user can read custom intelligence signals (`get` and `list`).
   * Analysts can only insert or update custom signals if they explicitly populate `authorId` using their verified `request.auth.uid`.
   * Immortality rule: `id`, `createdAt`, and `authorId` fields are strictly immutable after creation.
   * Value limits: `impact` must lie inside `[0, 100]`, and `aiConfidence` inside `[0, 100]`.

3. **User Chat History:**
   * Chat messages must belong to a verified authenticated analyst user.
   * Users can only fetch and subscribe to their own conversation lines (forced query enforcer: `resource.data.userId == request.auth.uid`).
   * No user can write messages claiming to belong to another user's identifier.

---

## 2. The "Dirty Dozen" Malicious Exploitation Payloads (To Block)

Here are 12 specific payloads crafted to breach security models, which our security rule blocks must mathematically invalidate:

### [Pillar 1: Identity Spoofing / Account Takeover]
* **Payload 1 (Malicious user profile interception):** User B attempts to overwrite User A's profile document with a mismatched UID.
* **Payload 2 (User self-privilege escalation):** Attempting to write a profile setting a fake field like `globalAdmin: true` or `clearanceLevel: 10`.
* **Payload 3 (Auth token hijacking):** Reading User A's profile details as User B.

### [Pillar 2: Integrity Breach / Resource Poisoning]
* **Payload 4 (Orphaned Signal Insert):** Attempting to insert a custom political signal with `authorId` set to a completely different user.
* **Payload 5 (Extreme value injection - Denial of Wallet):** Creating a political alert with a 2-megabyte string in `title` or `details`.
* **Payload 6 (Invalid hazard coefficients):** Submitting an alert with `impact: -500` or `impact: 9999` to break trend regression engines.
* **Payload 7 (Immortal fields update breach):** Trying to modify the `authorId` on an existing signal to transfer authorship tracking.
* **Payload 8 (Synthetic timestamp forgery):** Submitting a client-forged timestamp for `createdAt` instead of a server-enforced timestamp.

### [Pillar 3: Message Spoofing & Chat Scraping]
* **Payload 9 (Chat list scraping):** Authenticated user attempts a global query fetch on `/chatHistory` to scrap other analysts' query dialogues.
* **Payload 10 (Chat identity hijacking):** Intercepting and creating a message under `/chatHistory/{msgId}` claiming a `userId` that belongs to someone else.
* **Payload 11 (Chat state shortcutting):** Updating an existing chat message content after it has been stored (messages must be immutable).
* **Payload 12 (Junk characters ID poisoning):** Creating a document inside `/customSignals` with an alphanumeric ID containing abnormal regex poison scripts or exceeding 128 characters.
