# TokenService (JWT / Access + Refresh)

- generateAccessToken(userId)

- generateRefreshToken(userId)

- verifyAccessToken(token)

- hashRefreshToken(token)

# HashingService

- hashPassword(password)

- verifyHash(input, storedHash) → works for password, passkey, and security answers

# RateLimitService

- checkRateLimit(ip, userId, action) → enforce cooldowns / brute-force protection

- incrementAttempts(ip, userId)

# UserService

- getUserByUsername(username)

- createUser(profileData)

- updateUserSecurityState(userId, updates)

- EmailService (optional for forgot-password flows)

- sendRecoveryEmail(userId, token)

