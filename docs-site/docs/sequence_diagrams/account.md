## Account Creation (Atomic)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant BE as Backend
    participant DB as Database

    User->>BE: POST /api/accounts (Details)
    rect rgba(0, 0, 0, 0.05)
    Note over BE, DB: [Atomic Transaction Start]
    BE->>DB: 1. Create Account (Status: Active)
    BE->>DB: 2. Create Circle (Creator = Owner)
    BE->>DB: 3. Create Audit Log (Action: "CREATE")
    DB-->>BE: Success
    BE->>DB: COMMIT
    end
    BE-->>User: 201 Created
```

## Update & Archive (Soft Delete)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant BE as Backend
    participant DB as Database

    alt Update (Owner or Admin)
        User->>BE: PATCH /api/accounts/:id (Details)
        Note over BE: Logic: Prevent Balance Change
        BE->>DB: Update Record & Insert Log
        BE-->>User: 200 OK
    else Archive (Owner Only)
        User->>BE: DELETE /api/accounts/:id
        rect rgba(0, 0, 0, 0.05)
        Note over BE, DB: [Atomic Transaction Start]
        BE->>DB: 1. Check User is Owner
        BE->>DB: 2. Set Status = "Archived"
        BE->>DB: 3. Insert Audit Log
        DB-->>BE: Success
        BE->>DB: COMMIT
        end
        BE-->>User: 200 OK (Archived)
    end
```

## Fetch List & Fetch One (Circle-Based)

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant BE as Backend
    participant DB as Database

    Note over Member, BE: Fetch All List
    Member->>BE: GET /api/accounts
    BE->>DB: SELECT accounts WHERE Member_is_in_Circle AND Status='Active'
    DB-->>BE: List of Accounts
    BE-->>Member: 200 OK

    Note over Member, BE: Fetch One (Details)
    Member->>BE: GET /api/accounts/:id
    alt If Password Protected
        BE-->>Member: 401 (Prompt for Secondary Password)
        Member->>BE: POST /api/accounts/:id/verify (Secondary Pass)
        Note over BE: Check Attempt Count (5/20 Rule)
    end
    BE->>DB: Fetch Full Details
    BE-->>Member: 200 OK (Details)
```

## Audit Log Fetching (Privacy Rules)

```mermaid
sequenceDiagram
    autonumber
    actor Requester
    participant BE as Backend
    participant DB as Database

    Requester->>BE: GET /api/accounts/:id/logs

    alt Account is Archived
        BE->>BE: Logic: Is Requester Owner?
        alt Not Owner
            BE-->>Requester: 403 Forbidden
        end
    else Account is Active
        BE->>BE: Logic: Is Requester in Circle?
        alt Not in Circle
            BE-->>Requester: 403 Forbidden
        end
    end

    alt If Secondary Password Set
        BE-->>Requester: Prompt Secondary Password
        Requester->>BE: Verify Pass
    end

    BE->>DB: Fetch Logs
    BE-->>Requester: 200 OK (Logs)
```

## Security Lockout & Recovery

```mermaid
sequenceDiagram
    autonumber
    actor Owner
    participant BE as Backend
    participant DB as Database

    Note over Owner, BE: Brute Force Protection
    loop On Wrong Secondary Password
        BE->>DB: Increment Failed Attempts
        alt Attempts == 5
            BE-->>Owner: 30-Minute Cooldown active
        else Attempts == 20
            BE->>DB: Set Account Status = "PERMANENT_LOCK"
            BE-->>Owner: Account Locked. Use Recovery Key.
        end
    end

    Note over Owner, BE: Recovery Flow
    Owner->>BE: POST /api/accounts/:id/recover (Auth Recovery Key)
    BE->>DB: Verify Key against User Record
    rect rgba(0, 0, 0, 0.05)
    Note over BE, DB: [Atomic Transaction Start]
    BE->>DB: 1. Set Account Secondary Password = NULL
    BE->>DB: 2. Set Failed Attempts = 0
    BE->>DB: 3. Set Status = "Active"
    BE->>DB: 4. Insert Log (Action: "RECOVERED")
    DB-->>BE: Success
    end
    BE-->>Owner: 200 OK (Access Restored)
```

## Transfer Ownership (Double Verification)

```mermaid
sequenceDiagram
    autonumber
    actor Owner
    participant BE as Backend
    participant CH as Circle Handler
    participant DB as Database

    Owner->>BE: POST /api/accounts/:id/transfer (targetId, reason)

    Note over BE: 1. Secondary Security Layer
    alt If Account is Password Protected
        BE-->>Owner: 401 Unauthorized (Prompt Account Password)
        Owner->>BE: Submits Account Password
        BE->>BE: Verify Secondary Password
    end

    Note over BE: 2. Identity Confirmation (Sudo)
    BE-->>Owner: Prompt User Login Password
    Owner->>BE: Submits Login Password
    BE->>BE: Verify Current Session Identity

    rect rgba(0, 0, 0, 0.05)
    Note over BE, DB: [Atomic Transaction Start]

    BE->>DB: Update Account Record (owner_id = targetId)

    Note over BE, CH: 3. Invoke Circle Logic
    BE->>CH: ProcessRoleSwap(accountId, oldOwner, newOwner)
    CH->>DB: Update Circle Member Roles (New Owner = 'Owner', Old = 'Admin')

    BE->>DB: Insert Audit Log (Action: "OWNERSHIP_TRANSFER", Reason: "...")

    DB-->>BE: Commit Success
    end

    BE-->>Owner: 200 OK (Transfer Complete)
```
