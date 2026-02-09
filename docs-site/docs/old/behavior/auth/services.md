# AuthService

- login(username, password) → handle auth, generate JWT, check failed attempts & cooldown
- logout(userId, refreshToken) → revoke token
- register(username, password) → create user, profile, and initial JWTs
- validateAccessToken(token) → middleware to protect endpoints

# SessionService

- createSession(userId, deviceInfo) → create refresh token session
- revokeSession(refreshToken) → remove session from DB
- getActiveSessions(userId) → optional, for user session management

# SudoService

- startSudoSession(userId, method) → verify password / recovery key / MFA
- checkSudoSession(userId) → validate sudo session for sensitive actions

# SecurityService

- logEvent(userId, type, metadata) → record security events
- trackFailedLogin(userId) → increment attempts & set cooldown
- checkLockStatus(userId) → check permanent lock or cooldown