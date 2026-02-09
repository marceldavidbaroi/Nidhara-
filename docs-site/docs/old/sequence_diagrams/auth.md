

## ✅ Signin (fixed, strict-mermaid compatible)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend (UI)
    participant Browser as Browser Storage (Cookies)
    participant BE as Backend (API)
    participant DB as Database

    User->>FE: Enter Username & Password
    FE->>BE: POST /api/login (credentials)

    BE->>DB: Load users.id by username/email
    DB-->>BE: user_id / not found

    alt User not found
        BE-->>FE: HTTP 401 Unauthorized
        FE-->>User: "Invalid Credentials."
    else User exists
        BE->>DB: Read user_account_security_state (failed_attempts, cooldown_until, permanently_locked)
        DB-->>BE: security_state

        alt permanently_locked = TRUE OR failed_attempts >= 20
            BE-->>FE: HTTP 403 Forbidden
            FE-->>User: "Account Locked. Use Recovery Key to unlock."
        else cooldown_until != NULL AND now() < cooldown_until
            BE-->>FE: HTTP 429 Too Many Requests
            FE-->>User: "Too many attempts. Try again later."
        else Normal Processing
            BE->>DB: Validate password hash (auth_credentials where type='PASSWORD')
            DB-->>BE: match / mismatch

            alt Login Successful
                BE->>DB: Reset user_account_security_state.failed_attempts=0, cooldown_until=NULL
                BE->>BE: Generate Access JWT (short TTL)
                BE->>BE: Generate Refresh Token (opaque random)
                BE->>BE: Hash refresh token (refresh_token_hash)
                BE->>BE: Generate CSRF token (random)

                BE->>DB: INSERT auth_sessions(user_id, refresh_token_hash, csrf_token, ip_address, user_agent, device_name, expires_at, created_at)
                DB-->>BE: auth_session_id

                BE->>DB: INSERT security_events(user_id, type='LOGIN_SUCCESS', metadata={ip,user_agent,session_id})
                DB-->>BE: ok

                BE-->>FE: HTTP 200 OK
                BE-->>Browser: Set-Cookie access_token (HttpOnly, Secure, SameSite=Lax)
                BE-->>Browser: Set-Cookie refresh_token (HttpOnly, Secure, SameSite=Lax)
                BE-->>Browser: Set-Cookie csrf_token (Secure, SameSite=Lax)
                FE->>FE: Store csrf_token in memory (or read cookie)
                FE->>FE: Redirect to /dashboard
                FE-->>User: Show Dashboard UI

            else Login Failed
                BE->>DB: Update user_account_security_state.failed_attempts += 1, last_failed_at=now()
                DB-->>BE: new_failed_attempts

                BE->>DB: INSERT security_events(user_id, type='LOGIN_FAILED', metadata={ip,user_agent,attempt:new_failed_attempts})
                DB-->>BE: ok

                alt new_failed_attempts == 5
                    BE->>DB: Set user_account_security_state.cooldown_until = now()+15min
                    DB-->>BE: ok
                    BE-->>FE: HTTP 429 Too Many Requests
                    FE-->>User: "5 failed attempts. 15-minute cooldown active."
                else new_failed_attempts >= 20
                    BE->>DB: Set user_account_security_state.permanently_locked=TRUE
                    DB-->>BE: ok
                    BE->>DB: INSERT security_events(user_id, type='ACCOUNT_LOCKED', metadata={reason:'MAX_ATTEMPTS'})
                    DB-->>BE: ok
                    BE-->>FE: HTTP 403 Forbidden
                    FE-->>User: "Account Permanently Locked."
                else
                    BE-->>FE: HTTP 401 Unauthorized
                    FE-->>User: "Invalid Credentials. Attempt X of 20."
                end
            end
        end
    end

```

---

## ✅ Sign up (fixed, strict-mermaid compatible)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant Browser as Browser Storage (Cookies)
    participant BE as Backend (API)
    participant DB as Database

    User->>FE: Inputs Username, Email, Password, Confirm
    FE->>FE: Validate passwords match
    FE->>BE: POST /api/register (username,email,password)

    BE->>DB: Check uniqueness (users.username, users.email)
    DB-->>BE: ok / conflict

    alt Conflict
        BE-->>FE: HTTP 409 Conflict
        FE-->>User: "Username or Email already exists"
    else Create User
        BE->>DB: INSERT users(...)
        DB-->>BE: user_id

        BE->>BE: Hash password
        BE->>DB: INSERT auth_credentials(user_id, type='PASSWORD', secret_hash, metadata)
        DB-->>BE: ok

        BE->>DB: INSERT user_account_security_state(user_id, failed_attempts=0, permanently_locked=FALSE)
        DB-->>BE: ok

        BE->>BE: Generate Recovery Passkey (one-time)
        BE->>BE: Hash recovery passkey
        BE->>DB: INSERT recovery_keys(user_id, key_hash, created_at)
        DB-->>BE: ok

        BE->>BE: Generate Access JWT (short TTL)
        BE->>BE: Generate Refresh Token (opaque random)
        BE->>BE: Hash refresh token
        BE->>BE: Generate CSRF token

        BE->>DB: INSERT auth_sessions(user_id, refresh_token_hash, csrf_token, ip_address, user_agent, device_name, expires_at)
        DB-->>BE: session_id

        BE->>DB: INSERT security_events(user_id, type='LOGIN_SUCCESS', metadata={source:'register',session_id})
        DB-->>BE: ok

        BE-->>FE: HTTP 201 Created
        BE-->>Browser: Set-Cookie access_token (HttpOnly, Secure, SameSite=Lax)
        BE-->>Browser: Set-Cookie refresh_token (HttpOnly, Secure, SameSite=Lax)
        BE-->>Browser: Set-Cookie csrf_token (Secure, SameSite=Lax)

        FE-->>User: Show Recovery Passkey (One-time view)
        User->>FE: Click "OK / I have saved it"

        FE-->>User: Prompt: "Update profile now?"
        alt User selects "Update Profile"
            FE->>FE: Redirect to /profile/edit
        else Maybe Later
            FE->>FE: Redirect to /dashboard
        end

        FE-->>User: Show Tutorial (JS only)
    end

```

---

## ✅ Refresh (fixed, strict-mermaid compatible)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant Browser as Browser Storage (Cookies)
    participant BE as Backend (API)
    participant DB as Database

    FE->>FE: Access token expired (401)
    FE->>BE: POST /api/refresh (Header: X-CSRF-Token)
    Browser-->>BE: Sends refresh_token cookie automatically

    BE->>BE: Validate CSRF header vs csrf cookie
    alt CSRF invalid
        BE-->>FE: HTTP 403 Forbidden
        FE-->>User: "CSRF validation failed"
    else CSRF ok
        BE->>BE: Hash presented refresh_token
        BE->>DB: SELECT auth_sessions WHERE refresh_token_hash=hash AND revoked_at IS NULL AND expires_at > now()
        DB-->>BE: session found / not found

        alt Session not found
            BE-->>FE: HTTP 401 Unauthorized
            FE->>FE: Redirect to /login
        else Rotate
            BE->>BE: Generate new refresh token + hash
            BE->>BE: Generate new CSRF token
            BE->>BE: Generate new access JWT

            BE->>DB: UPDATE auth_sessions SET refresh_token_hash=newHash, csrf_token=newCsrf WHERE id=session_id
            DB-->>BE: ok

            BE->>DB: INSERT security_events(user_id, type='REFRESH_ROTATED', metadata={session_id})
            DB-->>BE: ok

            BE-->>FE: HTTP 200 OK
            BE-->>Browser: Set-Cookie access_token (HttpOnly, Secure, SameSite=Lax)
            BE-->>Browser: Set-Cookie refresh_token (HttpOnly, Secure, SameSite=Lax)
            BE-->>Browser: Set-Cookie csrf_token (Secure, SameSite=Lax)
        end
    end

```

---

## ✅ Logout (fixed, strict-mermaid compatible)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant Browser as Browser Storage (Cookies)
    participant BE as Backend (API)
    participant DB as Database

    User->>FE: Click "Logout"
    FE->>BE: POST /api/logout (Header: X-CSRF-Token)
    Browser-->>BE: Send access_token + refresh_token cookies

    BE->>BE: Validate CSRF header vs csrf cookie
    alt CSRF invalid
        BE-->>FE: HTTP 403 Forbidden
        FE-->>User: "CSRF validation failed"
    else CSRF ok
        BE->>BE: Hash refresh_token
        BE->>DB: UPDATE auth_sessions SET revoked_at=now() WHERE refresh_token_hash=hash AND revoked_at IS NULL
        DB-->>BE: ok

        BE->>DB: INSERT security_events(user_id, type='LOGOUT', metadata={ip,user_agent})
        DB-->>BE: ok

        BE-->>FE: HTTP 200 OK
        BE-->>Browser: Set-Cookie access_token (Max-Age=0, HttpOnly, Secure, SameSite=Lax)
        BE-->>Browser: Set-Cookie refresh_token (Max-Age=0, HttpOnly, Secure, SameSite=Lax)
        BE-->>Browser: Set-Cookie csrf_token (Max-Age=0, Secure, SameSite=Lax)

        FE->>FE: Clear local app state
        FE->>FE: Redirect to /login
        FE-->>User: Show Login Screen
    end

```



---

### **Regenerate Recovery Passkey (DB-aligned: sudo_sessions + recovery_keys update)**

Your DB has both `sudo_sessions` and `recovery_keys`, so this should explicitly touch both.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant Browser as Browser Storage (Cookies)
    participant BE as Backend (API)
    participant DB as Database

    User->>FE: Click "Regenerate Recovery Passkey"
    FE-->>User: Prompt: "Enter password to continue"

    User->>FE: Inputs Password
    FE->>BE: POST /api/user/regenerate-key (password, Header: X-CSRF-Token)
    Note over Browser: Browser attaches HttpOnly access_token cookie

    BE->>BE: Validate Access JWT
    BE->>BE: Validate CSRF (header+cookie)

    BE->>DB: Verify password via auth_credentials(type='PASSWORD')
    DB-->>BE: password ok / fail

    alt Password fail
        BE-->>FE: HTTP 401 Unauthorized
        FE-->>User: "Incorrect password"
    else Password ok
        Note over BE: Enable Sudo Mode (time-boxed)
        BE->>DB: UPSERT sudo_sessions(user_id, sudo_until=now()+10min, method='PASSWORD', ip_address, user_agent, created_at)
        DB-->>BE: ok

        BE->>BE: Generate new recovery passkey
        BE->>BE: Hash passkey

        BE->>DB: UPDATE recovery_keys SET used_at=now() WHERE user_id=user_id AND used_at IS NULL
        DB-->>BE: ok
        BE->>DB: INSERT recovery_keys(user_id, key_hash, created_at)
        DB-->>BE: ok

        BE->>DB: INSERT security_events(user_id, type='RECOVERY_KEY_REGENERATED', metadata={ip,user_agent})
        DB-->>BE: ok

        BE-->>FE: HTTP 200 OK (Body: { newPasskey: "GHIJ-9876-KLMN" })
        FE-->>User: Display new passkey (one-time view)
        User->>FE: Click "Done"
        FE->>FE: Close modal / redirect
    end
```

---

### **Forgot Password (DB-aligned: uses recovery_keys / security_questions + rate limit + password credential update)**

No extra tables were defined for temp tokens, so I model temp token as **signed/short-lived** (or you can add a table later).

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant BE as Backend (API + Rate Limiter)
    participant DB as Database

    User->>FE: Click "Forgot Password"
    FE-->>User: Prompt: "Enter Username"
    User->>FE: Submits Username
    FE->>BE: POST /api/recover/initiate (username)

    BE->>DB: Lookup user_id by username
    DB-->>BE: user_id / not found

    alt User not found
        BE-->>FE: HTTP 200 OK (methods: none) 
        Note over FE: Avoid user enumeration
        FE-->>User: "If account exists, choose a recovery method"
    else User found
        BE-->>FE: HTTP 200 OK (methods: ['RECOVERY_KEY','SECURITY_QUESTIONS'])
    end

    alt Method: Recovery Passkey
        User->>FE: Enters Recovery Passkey
        FE->>BE: POST /api/recover/verify-key (username, passkey)

        BE->>BE: Rate limit check (IP + user_id)
        alt Rate limit exceeded
            BE-->>FE: HTTP 429 Too Many Requests
            FE-->>User: "Too many attempts"
        else Allowed
            BE->>BE: Hash provided passkey
            BE->>DB: Validate against recovery_keys.key_hash where user_id=user_id and used_at IS NULL
            DB-->>BE: valid / invalid

            alt Invalid
                BE-->>FE: HTTP 401 Unauthorized
                FE-->>User: "Invalid recovery key"
            else Valid
                BE->>DB: UPDATE recovery_keys SET used_at=now() WHERE user_id=user_id AND key_hash=hash
                DB-->>BE: ok
                BE->>DB: INSERT security_events(user_id, type='RECOVERY_KEY_USED', metadata={method:'RECOVERY_KEY'})
                DB-->>BE: ok

                BE-->>FE: HTTP 200 OK (Body: { tempResetToken: "SIGNED_SHORT_LIVED" })
            end
        end

    else Method: Security Questions
        FE->>BE: GET /api/recover/questions (username)
        BE->>DB: SELECT question FROM security_questions WHERE user_id=user_id
        DB-->>BE: questions
        BE-->>FE: HTTP 200 OK (questions)

        User->>FE: Answers questions
        FE->>BE: POST /api/recover/verify-answers (username, answers)

        BE->>BE: Rate limit check
        BE->>DB: Verify answers against security_questions.answer_hash
        DB-->>BE: ok / fail

        alt Fail
            BE-->>FE: HTTP 401 Unauthorized
            FE-->>User: "Incorrect answers"
        else Ok
            BE->>DB: INSERT security_events(user_id, type='RECOVERY_KEY_USED', metadata={method:'SECURITY_QUESTIONS'})
            DB-->>BE: ok
            BE-->>FE: HTTP 200 OK (Body: { tempResetToken: "SIGNED_SHORT_LIVED" })
        end
    end

    User->>FE: Enter New Password + Confirm
    FE->>BE: POST /api/recover/reset (username, newPassword, tempResetToken)

    BE->>BE: Validate tempResetToken signature + expiry
    BE->>BE: Hash new password
    BE->>DB: UPDATE auth_credentials SET secret_hash=newHash WHERE user_id=user_id AND type='PASSWORD'
    DB-->>BE: ok

    Note over BE: Invalidate all sessions after password reset
    BE->>DB: UPDATE auth_sessions SET revoked_at=now() WHERE user_id=user_id AND revoked_at IS NULL
    DB-->>BE: ok

    BE->>DB: INSERT security_events(user_id, type='PASSWORD_CHANGED', metadata={source:'recovery'})
    DB-->>BE: ok

    BE-->>FE: HTTP 200 OK
    FE->>FE: Redirect to /login
```

---

#