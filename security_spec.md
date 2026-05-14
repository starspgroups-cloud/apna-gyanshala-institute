# Firebase Security Specification

## 1. Data Invariants
- A user document must have a unique ID matching their `request.auth.uid`.
- Roles can only be 'admin' or 'student'.
- Only admins can create other users (though students can register themselves, which we'll handle with a specific rule).
- Users cannot change their own `role` after creation.
- `createdAt` is immutable.
- `updatedAt` must be the current server time.

## 2. The "Dirty Dozen" Payloads (Anti-Patterns)
1. **Identity Theft**: Creating a user document with an ID different from the auth UID.
2. **Privilege Escalation**: A student trying to update their role to 'admin'.
3. **Shadow Field Injection**: Adding an `isAdmin: true` field to a user document that isn't in the schema.
4. **Orphaned Record**: Creating a student without a name or email.
5. **Timestamp Spoofing**: Providing a client-side `createdAt` date from the past.
6. **Role Hijacking**: An authenticated student attempting to delete an admin record.
7. **Cross-User Snooping**: A student trying to read another student's private profile (if we had private fields, but here we'll restrict based on UID).
8. **Bulk Scraping**: Attempting to list all users without being an admin.
9. **Status Manipulation**: A student attempting to approve their own 'Pending' status.
10. **ID Poisoning**: Using a 2KB string as a `userId`.
11. **Immutable Violation**: Changing the `createdAt` field on update.
12. **Unverified Spam**: Registering and writing data without a verified email (though for first-time reg we might allow unverified if needed, but the rule says mandate verified).

## 3. Test Runner (Draft)
I will implement `firestore.rules.test.ts` to verify these blocks.

---

## Firestore Rules Draft (DRAFT_firestore.rules)
Next step is generating the rules.
