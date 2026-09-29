# Supabase

Schema changes belong in `migrations/` and are applied with the Supabase CLI. Dashboard edits are not the source of truth.

## Email OTP (signup + password recovery)

The app uses **in-app 8-digit OTP** for both signup email verification and forgot-password (not a browser confirm/reset link).

`EMAIL_OTP_LENGTH` in the app must match **Authentication → Sign In / Providers → Email → Email OTP length** (set to `8`).

### Manual dashboard setup (required for hosted projects)

1. **Authentication → Sign In / Providers → Email**
   - **Confirm email**: ON
   - **Email OTP length**: `8`
2. **Authentication → Email Templates → Confirm signup**
   - Subject: `Your Calio verification code`
   - Body: paste `templates/confirmation-otp.html` (must include `{{ .Token }}`, must **not** include `{{ .ConfirmationURL }}`).
3. **Authentication → Email Templates → Reset password**
   - Subject: `Your Calio password reset code`
   - Body: paste `templates/recovery-otp.html` (must include `{{ .Token }}`, must **not** include `{{ .ConfirmationURL }}`).
4. Save and test signup + forgot-password from the app.

Local `config.toml` already sets `enable_confirmations = true`, `otp_length = 8`, and wires both templates for `supabase start`.

Auth uses Supabase Auth only for password hashing. The mobile client never stores or hashes passwords.

When a user-owned table is added:

1. Add a SQL migration in `migrations/`.
2. Enable row level security in that migration.
3. Add policies that limit rows to the signed-in user (`auth.uid()`).
4. Grant only the privileges the app needs.

Do not put the service-role key, database password, or other secrets in the mobile app or in this directory.

`functions/` is for Edge Functions that must run with server-only credentials. `seed/` is for local development data.
