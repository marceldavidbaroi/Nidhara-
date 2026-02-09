**The Transaction Lifecycle (Pending to Cleared)**

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant BE as Backend
    participant DB as Database

    User->>BE: POST /api/transactions (data, status: 'Pending' OR 'Cleared')

    rect rgba(0, 0, 0, 0.05)
    Note over BE, DB: [Atomic Transaction Start]
    BE->>DB: 1. INSERT Transaction Record
    BE->>DB: 2. INSERT Audit Log (Action: 'CREATE')

    alt Status is 'Cleared'
        Note over BE, DB: Immediate Financial Impact
        BE->>DB: 3. Update Account Balance
        BE->>DB: 4. INSERT Immutable Ledger Entry
        BE->>DB: 5. Update Summaries (Daily/Weekly/Monthly/Yearly)
    end

    DB-->>BE: Success
    BE->>DB: COMMIT
    end

    BE-->>User: 201 Created
```

**The "Manual Confirmation" Flow (Post-Creation)**

```mermaid
sequenceDiagram
    autonumber
    actor User as Creator / Admin / Owner
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Note over User, FE: User clicks "Clear" on a Pending Transaction
    FE->>BE: PATCH /api/transactions/:id/clear

    rect rgba(0, 255, 0, 0.05)
    Note over BE, DB: [Atomic Financial Write]
    BE->>BE: Verify: Role is Admin/Owner OR User is Creator

    BE->>DB: 1. Update Account Balance
    BE->>DB: 2. INSERT Ledger Entry
    BE->>DB: 3. Update Summaries
    BE->>DB: 4. SET Transaction status = 'Cleared'
    BE->>DB: 5. INSERT Audit Log

    DB-->>BE: Success
    BE->>DB: COMMIT
    end

    BE-->>FE: 200 OK (UI updates balance)
```

**Bulk Transaction Creation (Atomic Batch)**

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant BE as Backend
    participant DB as Database

    User->>BE: POST /api/transactions/bulk (Array of 10 Transactions)

    rect rgba(0, 0, 0, 0.05)
    Note over BE, DB: [Single Atomic Transaction Start]

    loop For Each Transaction in Array
        BE->>DB: 1. INSERT Transaction (Pending/Cleared)
        BE->>DB: 2. INSERT Audit Log

        alt If Status is 'Cleared'
            BE->>DB: 3. Update Account Balance
            BE->>DB: 4. INSERT Ledger Entry
            BE->>DB: 5. Update Summaries
        end
    end

    alt All Successful
        DB-->>BE: All operations OK
        BE->>DB: COMMIT
        BE-->>User: 201 Created (Success for all 10)
    else Any Error (e.g., Row 7 has invalid category)
        DB-->>BE: Error on Item #7
        BE->>DB: ROLLBACK (All 10 are undone)
        BE-->>User: 400 Bad Request (Error details for Row 7)
    end
    end
```

**Update Logic (Immutable Ledger Pattern)**

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant BE as Backend
    participant DB as Database

    User->>BE: PATCH /api/transactions/:id (New Amount: "75.00")

    rect rgba(255, 165, 0, 0.05)
    Note over BE, DB: [Atomic Update Transaction Start]
    BE->>DB: 1. Fetch Old Record (Status, Amount)

    alt If Status is 'Cleared'
        Note over BE, DB: Financial Reversal & Re-application
        BE->>DB: 2. INSERT Ledger Entry (Action: REVERSE, Amount: -OldAmount)
        BE->>DB: 3. INSERT Ledger Entry (Action: UPDATE, Amount: NewAmount)
        BE->>DB: 4. Update Account Balance (Net change: New - Old)
        BE->>DB: 5. Update Summaries (Adjust totals for the specific date)
    end

    BE->>DB: 6. UPDATE Transaction Record (Amount, Description, etc.)
    BE->>DB: 7. INSERT Audit Log (Action: "UPDATED")

    DB-->>BE: All operations successful
    BE->>DB: COMMIT
    end

    BE-->>User: 200 OK
```

**Void & Revive (Soft Delete Only)**

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant BE as Backend
    participant DB as Database

    User->>BE: PATCH /api/transactions/:id (New Data)

    rect rgba(255, 165, 0, 0.05)
    Note over BE, DB: [Atomic Update Start]
    BE->>DB: 1. Fetch Current Status & Amount

    alt Status is 'Cleared'
        Note over BE, DB: Full Financial Adjustment
        BE->>DB: 2. INSERT Ledger (Action: REVERSE, -OldAmount)
        BE->>DB: 3. INSERT Ledger (Action: UPDATE, +NewAmount)
        BE->>DB: 4. Update Account Balance (Net Difference)
        BE->>DB: 5. Update Summaries (Instant Recalculation)
    else Status is 'Pending'
        Note over BE, DB: Simple Data Update
        BE->>BE: Skip Ledger/Balance/Summary
    end

    BE->>DB: 6. UPDATE Transaction Record
    BE->>DB: 7. INSERT Audit Log
    DB-->>BE: Success
    BE->>DB: COMMIT
    end
    BE-->>User: 200 OK
```

**Visibility & Fetching**

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant BE as Backend
    participant DB as Database

    Member->>BE: GET /api/transactions/ledger OR /logs
    BE->>DB: Check Account Status
    alt Account is 'Archived'
        BE->>BE: Only allow if Member is 'Owner'
    else Account is 'Active'
        BE->>BE: Allow if Member is in Circle
    end
    BE->>DB: SELECT data
    BE-->>Member: 200 OK
```

---

```mermaid

```
