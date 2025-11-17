# Implementation Plan - Refatoração do Sistema de Autenticação Mobile

## Task Overview

Este plano implementa a refatoração do sistema de autenticação no app mobile JOGAI para alinhar com os endpoints reais do backend. As tarefas estão organizadas em fases incrementais que podem ser testadas independentemente.

---

## Phase 1: Update Types and API Contracts

- [x] 1. Update API types to match backend responses
  - [x] 1.1 Update LoginResponse type
    - Add sessionId: string field
    - Ensure accessToken and refreshToken are present
    - Update JSDoc comments with backend endpoint reference
    - _Requirements: 1.2, 10.1_
  
  - [x] 1.2 Update RegisterRequest type
    - Make phone optional (string | null | undefined)
    - Add organizationName optional field
    - Remove name field if not in backend
    - Update validation comments
    - _Requirements: 1.3, 10.2_
  
  - [x] 1.3 Update RegisterResponse type
    - Add id, name, email fields
    - Add optional organizationId field
    - Add optional membershipId field
    - Remove fields not returned by backend
    - _Requirements: 1.3, 10.2_
  
  - [x] 1.4 Create RefreshTokenRequest type
    - Add sessionId: string field (required)
    - Add refreshToken: string field (required)
    - _Requirements: 1.4, 10.3_
  
  - [x] 1.5 Create LogoutRequest type
    - Add sessionId: string field (required)
    - _Requirements: 1.5, 10.4_
  
  - [x] 1.6 Create password reset types
    - Create RequestPasswordResetRequest with email field
    - Create ResetPasswordRequest with token and password fields
    - _Requirements: 1.6, 1.7, 8.1, 8.4_

- [x] 2. Update authApi.ts to use correct endpoints
  - [x] 2.1 Update login method
    - Change endpoint to POST /auth/login
    - Update return type to include sessionId
    - Add proper error handling
    - _Requirements: 1.1, 1.2_
  
  - [x] 2.2 Update register method
    - Change endpoint to POST /auth/register
    - Update request payload to match backend
    - Update return type to RegisterResponse
    - _Requirements: 1.3_
  
  - [x] 2.3 Update refreshToken method
    - Change endpoint to POST /auth/refresh
    - Update request to include sessionId and refreshToken
    - Update return type
    - _Requirements: 1.4_
  
  - [x] 2.4 Update logout method
    - Change endpoint to POST /auth/logout
    - Update request to include sessionId
    - _Requirements: 1.5_
  
  - [x] 2.5 Update password reset methods
    - Update requestPasswordReset to POST /auth/password/request-reset
    - Update resetPassword to POST /auth/password/reset
    - Remove forgotPassword if it's a duplicate
    - _Requirements: 1.6, 1.7, 8.1, 8.4_
  
  - [x] 2.6 Update email verification methods
    - Update sendEmailVerification to POST /auth/email/send-verification
    - Update verifyEmail to POST /auth/email/verify
    - _Requirements: 1.8_

---

## Phase 2: Update Storage Service

- [x] 3. Add sessionId management to storageService
  - [x] 3.1 Add sessionId storage methods
    - Add KEYS.SESSION_ID constant
    - Implement saveSessionId(sessionId: string) method
    - Implement getSessionId() method returning string | null
    - Implement clearSessionId() method
    - _Requirements: 2.1, 2.4, 6.2_
  
  - [x] 3.2 Update clearAll method
    - Include SESSION_ID in multiRemove array
    - Ensure all auth data is cleared together
    - _Requirements: 2.5, 6.4_
  
  - [x] 3.3 Update saveTokens method
    - Use multiSet for atomic operation
    - Add error handling
    - _Requirements: 6.1_

---

## Phase 3: Update Auth Service

- [x] 4. Update authService.login method
  - Extract sessionId from login response
  - Store sessionId using storageService.saveSessionId
  - Store tokens using storageService.saveTokens
  - Fetch and store user data
  - Add proper error handling with user-friendly messages
  - _Requirements: 1.2, 2.1, 3.1, 3.2, 6.1_

- [x] 5. Update authService.register method
  - Update to use new RegisterRequest type
  - Remove auto-login behavior
  - Return RegisterResponse directly
  - Add validation for optional fields
  - Add proper error handling
  - _Requirements: 1.3, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Update authService.logout method
  - Retrieve sessionId from storage
  - Call logout API with sessionId
  - Clear all data even if API call fails
  - Add proper error handling
  - _Requirements: 1.5, 2.3, 2.5_

- [x] 7. Update authService.refreshTokens method
  - Retrieve both refreshToken and sessionId from storage
  - Call refresh API with both parameters
  - Update stored tokens on success
  - Clear all data on failure
  - Return boolean indicating success
  - _Requirements: 1.4, 2.2, 4.2, 4.3, 4.4_

- [x] 8. Update password reset methods
  - [x] 8.1 Update requestPasswordReset method
    - Use new endpoint /auth/password/request-reset
    - Add proper error handling
    - _Requirements: 8.1, 8.2_
  
  - [x] 8.2 Update resetPassword method
    - Use new endpoint /auth/password/reset
    - Accept token and password parameters
    - Add proper error handling
    - _Requirements: 8.3, 8.4, 8.5_

- [x] 9. Add centralized error handling
  - Create handleError private method
  - Map HTTP status codes to user-friendly messages
  - Handle 400, 401, 429, 500 status codes
  - Handle network errors
  - Return localized error messages in Portuguese
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

---

## Phase 4: Update Axios Interceptors

- [x] 10. Update request interceptor
  - Add access token to Authorization header
  - Handle missing token gracefully
  - _Requirements: 4.5_

- [x] 11. Implement response interceptor for auto-refresh
  - [x] 11.1 Detect 401 errors
    - Check for 401 status code
    - Check if request hasn't been retried (_retry flag)
    - _Requirements: 4.1_
  
  - [x] 11.2 Implement auto-refresh logic
    - Call authService.refreshTokens()
    - Retry original request with new token on success
    - Clear auth and reject on failure
    - Prevent infinite retry loops
    - _Requirements: 4.2, 4.3, 4.4_

---

## Phase 5: Update Auth Context

- [x] 12. Update AuthContext state and methods
  - [x] 12.1 Update initialization logic
    - Check for accessToken, refreshToken, and sessionId
    - Load user data if all three are present
    - Set isAuthenticated based on complete auth state
    - _Requirements: 9.1, 9.2_
  
  - [x] 12.2 Update login method
    - Call authService.login
    - Update user state on success
    - Propagate errors to UI
    - _Requirements: 9.3_
  
  - [x] 12.3 Update register method
    - Call authService.register
    - Do NOT update user state (no auto-login)
    - Return success to allow navigation to login
    - _Requirements: 7.4_
  
  - [x] 12.4 Update logout method
    - Call authService.logout
    - Clear user state
    - Handle errors gracefully
    - _Requirements: 9.4_
  
  - [x] 12.5 Add refreshAuth method
    - Call authService.refreshTokens
    - Clear user state on failure
    - Keep user state on success
    - _Requirements: 9.5_

---

## Phase 6: Update UI Screens

- [x] 13. Update LoginScreen
  - [x] 13.1 Update form validation
    - Add email format validation
    - Add password required validation
    - Show validation errors inline
    - Disable submit button until valid
    - _Requirements: 5.1, 5.4, 5.5_
  
  - [x] 13.2 Update login handler
    - Call AuthContext.login
    - Show loading state during request
    - Display error messages from authService
    - Navigate to home on success
    - _Requirements: 3.1, 3.2_
  
  - [x] 13.3 Add forgot password link
    - Navigate to ForgotPasswordScreen
    - _Requirements: 8.1_

- [x] 14. Update RegisterScreen
  - [x] 14.1 Update form fields
    - Keep email and password as required
    - Make phone optional
    - Add organizationName optional field
    - Update field labels and placeholders
    - _Requirements: 1.3, 5.3_
  
  - [x] 14.2 Update form validation
    - Validate email format
    - Validate password minimum 8 characters
    - Validate optional phone format
    - Show validation errors inline
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  
  - [x] 14.3 Update register handler
    - Call AuthContext.register
    - Show loading state during request
    - Display error messages from authService
    - Navigate to login screen on success with success message
    - Do NOT auto-login user
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ] 15. Update ForgotPasswordScreen
  - [ ] 15.1 Update UI
    - Add email input field
    - Add submit button
    - Add back to login link
    - _Requirements: 8.1_
  
  - [ ] 15.2 Implement request password reset
    - Validate email format
    - Call authService.requestPasswordReset
    - Show success message "Email de recuperação enviado"
    - Handle errors with user-friendly messages
    - _Requirements: 8.1, 8.2_

- [ ] 16. Create ResetPasswordScreen
  - [ ] 16.1 Create screen component
    - Add token input or extract from deep link
    - Add new password input
    - Add confirm password input
    - Add submit button
    - _Requirements: 8.3_
  
  - [ ] 16.2 Implement password reset
    - Validate password minimum 8 characters
    - Validate password confirmation matches
    - Call authService.resetPassword with token and password
    - Show success message
    - Navigate to login screen on success
    - Handle errors with user-friendly messages
    - _Requirements: 8.3, 8.4, 8.5_

---

## Phase 7: Client-Side Validation

- [ ] 17. Create validation utilities
  - [ ] 17.1 Create email validator
    - Implement RFC 5322 compliant regex
    - Return boolean or error message
    - _Requirements: 5.1_
  
  - [ ] 17.2 Create password validator
    - Check minimum 8 characters
    - Return boolean or error message
    - _Requirements: 5.2_
  
  - [ ] 17.3 Create phone validator
    - Accept international format
    - Make it optional
    - Return boolean or error message
    - _Requirements: 5.3_
  
  - [ ] 17.4 Create required field validator
    - Check for empty strings
    - Trim whitespace
    - Return boolean or error message
    - _Requirements: 5.4_

---

## Phase 8: Error Handling and User Feedback

- [ ] 18. Create error handler utility
  - Map API errors to user-friendly messages
  - Handle network errors
  - Handle validation errors
  - Handle rate limit errors
  - Return localized messages in Portuguese
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 19. Add error display components
  - Create ErrorMessage component for inline errors
  - Create Toast/Snackbar for global errors
  - Add loading states to all forms
  - Add success messages for actions
  - _Requirements: 3.1, 3.2, 3.3_

---

## Phase 9: Testing

- [ ] 20. Create unit tests for services
  - [ ] 20.1 Test storageService
    - Test saveSessionId and getSessionId
    - Test clearAll includes sessionId
    - Test error handling
  
  - [ ] 20.2 Test authService
    - Test login stores sessionId
    - Test logout sends sessionId
    - Test refreshTokens uses sessionId
    - Test error handling and messages
  
  - [ ] 20.3 Test validation utilities
    - Test email validation
    - Test password validation
    - Test phone validation

- [ ] 21. Create integration tests
  - [ ] 21.1 Test AuthContext
    - Test initialization with stored session
    - Test login flow
    - Test logout flow
    - Test register flow (no auto-login)
  
  - [ ] 21.2 Test API interceptors
    - Test auto-refresh on 401
    - Test retry logic
    - Test error handling

- [ ] 22. Create E2E tests
  - Test complete registration flow: Register → Login → Home
  - Test login flow: Login → Home → Logout
  - Test password reset flow: Request → Reset → Login
  - Test token refresh: Login → Wait → Auto-refresh → Continue

---

## Phase 10: Documentation and Cleanup

- [ ] 23. Update documentation
  - Document new API types
  - Document sessionId management
  - Document error handling
  - Add code comments for complex logic
  - Update README with authentication flow

- [ ] 24. Code cleanup
  - Remove unused code (old endpoints, types)
  - Remove console.logs in production
  - Format code consistently
  - Run linter and fix issues
  - Update dependencies if needed

- [ ] 25. Final validation
  - Test all authentication flows manually
  - Verify sessionId is stored and used correctly
  - Verify auto-refresh works
  - Verify error messages are user-friendly
  - Verify logout clears all data
  - Test on both iOS and Android

---

## Notes

- Each task should be completed and tested before moving to the next
- Mark sub-tasks as complete only when fully implemented and tested
- Test on both iOS and Android simulators/devices
- Verify network requests in React Native Debugger
- Check AsyncStorage contents using Flipper
- All error messages should be in Portuguese
- Never log tokens or passwords in production

## Dependencies

- Phase 2 depends on Phase 1 (types must be updated first)
- Phase 3 depends on Phase 2 (storage must support sessionId)
- Phase 4 depends on Phase 3 (service must use new methods)
- Phase 5 depends on Phase 3 (context uses service)
- Phase 6 depends on Phase 5 (UI uses context)
- Phase 7 can be done in parallel with Phase 3-5
- Phase 8 can be done in parallel with Phase 6
- Phase 9 should be done after Phase 6
- Phase 10 should be done last
