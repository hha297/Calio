# Supabase

Schema changes belong in `migrations/` and are applied with the Supabase CLI. Dashboard edits are not the source of truth.

## Password recovery (email OTP)

The app uses **in-app OTP** for forgot-password (not a deep link).

### Manual dashboard setup (required — not applied from this repo)

1. **Authentication → Email Templates → Reset password**
   - Subject: `Your Calio password reset code`
   - Body: paste `templates/recovery-otp.html` (must include `{{ .Token }}`, must **not** include `{{ .ConfirmationURL }}`).
2. **Authentication → Sign In / Providers → Email**
   - Confirm **Email OTP length** is `8` (matches `RECOVERY_OTP_LENGTH` in the app).
   - Supabase generates the OTP; Resend (or your SMTP) only delivers the message.
3. Save and send a test reset from the app.

Auth uses Supabase Auth only for password hashing. The mobile client never stores or hashes passwords.

When a user-owned table is added:

1. Add a SQL migration in `migrations/`.
2. Enable row level security in that migration.
3. Add policies that limit rows to the signed-in user (`auth.uid()`).
4. Grant only the privileges the app needs.

Do not put the service-role key, database password, or other secrets in the mobile app or in this directory.

`functions/` is for Edge Functions that must run with server-only credentials. `seed/` is for local development data.
