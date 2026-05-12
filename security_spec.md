# Firestore Security Specification - Econlibery-MBSTU Library

## 1. Data Invariants
- A book must have a title and author to be listed.
- A donor must have a name to be recognized.
- Users are created with a 'pending' level by default.
- Only admins can modify financial transactions or update book/event/donor information.
- Public users can view books, donors, and events without authentication.

## 2. The "Dirty Dozen" Payloads (Expected to be DENIED)
1. **Public Book Write**: Create a book as an unauthenticated user.
2. **Standard User Book Edit**: Modify a book's status as a 'reader' user.
3. **Public Donor Delete**: Delete a donor record as an unauthenticated user.
4. **Self-Promotion**: Update own user profile to `role: 'admin'`.
5. **Private Profile Read**: Read another user's profile as a non-admin.
6. **Financial Tampering**: Create a transaction entry as a non-admin.
7. **Phantom Event**: Create an event with a 1MB string title.
8. **Broken Schema Book**: Create a book without a title (even as admin).
9. **Illegal ID**: Create a document with an ID containing `$` or other illegal characters.
10. **Transaction Stealth**: Delete a transaction record as a standard user.
11. **Spoofed Ownership**: Create a user profile for a different UID.
12. **Mass Listing**: Attempt to list all user profiles as a standard reader.

## 3. Test Scenarios
- **Scenario A**: Unauthenticated visitor lands on `/books`.
  - *Expectation*: `list` on `books` collection succeeds.
- **Scenario B**: Logged-in 'reader' attempts to edit a book.
  - *Expectation*: `update` on `books` collection fails (PERMISSION_DENIED).
- **Scenario C**: Admin attempts to create a new transition.
  - *Expectation*: `create` on `transactions` collection succeeds.
- **Scenario D**: New visitor registers via `/register`.
  - *Expectation*: `create` on `users` collection succeeds with `role: 'reader'` and `registrationStatus: 'pending'`.
