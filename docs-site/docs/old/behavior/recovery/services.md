# RecoveryService

- initiateRecovery(username) → return available methods
- verifyPasskey(username, passkey) → validate hashed recovery key
- fetchSecurityQuestions(username) → return user’s security questions
- verifySecurityAnswers(username, answers) → validate security questions
- resetPassword(username, tempToken, newPassword) → reset password and invalidate old keys
- regenerateRecoveryKey(userId) → generate new recovery passkey