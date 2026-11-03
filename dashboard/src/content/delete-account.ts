import { SITE_URL, SUPPORT_EMAIL, SUPPORT_PHONE } from '@/config/site';

/** Public account-deletion copy grounded in the mobile + Edge Function implementation. */
export const deleteAccountPage = {
  eyebrow: 'Account deletion',
  title: 'Delete your Trackwise account',
  intro:
    'You can permanently delete your Trackwise account from the mobile app. This page explains how, what happens to your data, and how to request deletion by email if you cannot open the app.',
  inApp: {
    title: 'Delete your account in the app',
    body: 'Account deletion is available to signed-in users in the Trackwise mobile app. There is no website login for this process.',
    steps: [
      'Open the Trackwise app and sign in with the account you want to delete.',
      'Go to the Account tab.',
      'Open the Privacy & data section.',
      'Tap Delete account.',
      'Read the warning, then confirm with Delete forever.',
    ],
    note: 'Optional: before deleting the account, you can Export data for a JSON backup, or use Delete account data to remove tracked records while keeping your login.',
  },
  emailRequest: {
    title: 'Cannot access the app?',
    body: `If you cannot sign in or use the in-app flow, email ${SUPPORT_EMAIL} (or call ${SUPPORT_PHONE}) to request account deletion.`,
    includeHeading: 'Include in your message',
    includeItems: [
      'Subject line such as “Trackwise account deletion request”.',
      'The email address used for your Trackwise account.',
      'A clear statement that you want the account permanently deleted.',
      'Any extra detail that helps us verify you control that account (for example the approximate signup method: email or Google).',
    ],
    verification:
      'We verify requests against the account email and related account records before deleting. We may reply asking for confirmation from the same email address on file. Do not send passwords.',
    timing:
      'In-app deletion is processed immediately when the request succeeds. Email requests are handled manually; we aim to complete verified deletion requests without undue delay, typically within a few business days.',
  },
  data: {
    title: 'Data deletion and retention',
    deletedHeading: 'Deleted when the account is removed',
    deletedIntro:
      'In-app deletion calls the Trackwise delete-account service, which removes the Auth user. Related rows owned by that user are removed through database foreign-key cascades, including for example:',
    deletedItems: [
      'Sign-in identity for that account (Supabase Auth user).',
      'Profile and onboarding progress.',
      'Food diary entries, custom foods, and food favorites.',
      'Workouts, workout exercises/sets, custom exercises, and exercise favorites.',
      'User-created workout templates (system catalog templates are kept).',
      'Goals and body measurements.',
      'Account role rows tied to that user.',
    ],
    retainedHeading: 'What may remain',
    retainedItems: [
      {
        title: 'Uploaded image files (Cloudinary)',
        body: 'Avatar, food, or custom-exercise photos are stored as HTTPS URLs in your records. Deleting the account removes those database references. The binary files on Cloudinary are not automatically purged by the current deletion function and may remain as orphaned objects until cleaned up operationally.',
      },
      {
        title: 'Operational backups and logs',
        body: 'Encrypted provider backups and server logs may retain residual copies for a limited time after deletion. Those copies are purged according to provider backup cycles, typically within 30 to 90 days, except where longer retention is required by law or for security investigations.',
      },
      {
        title: 'Admin audit metadata',
        body: 'If an admin audit log entry referenced your user id, the actor field may be cleared (set to null) while the log row itself can remain for security/ops history.',
      },
      {
        title: 'Shared catalog content',
        body: 'System foods, system exercises, and other shared catalog data are not personal account data and are not deleted when one user leaves.',
      },
      {
        title: 'App-store platform records',
        body: 'Google Play (and later App Store) may keep their own purchase, install, or review records under their policies. Trackwise does not control those platform records.',
      },
    ],
  },
  links: {
    privacyHref: '/privacy',
    privacyLabel: 'Privacy Policy',
    supportHref: '/support',
    supportLabel: 'Support Center',
    mailto: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Trackwise account deletion request')}`,
    canonicalPath: '/delete-account',
    canonicalUrl: `${SITE_URL}/delete-account`,
  },
} as const;
