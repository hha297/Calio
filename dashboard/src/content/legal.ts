export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const privacyDraftNotice =
  'Draft — This policy requires review and confirmation before publication.';

export const termsDraftNotice =
  'Draft — These terms require owner review and confirmation before publication.';

export const privacySections: LegalSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction',
    paragraphs: [
      'This Privacy Policy describes how Trackwise (“Trackwise,” “we,” “us,” or “our”) handles information when you use the Trackwise mobile application and the public website at trackwise.one.',
      'Trackwise provides everyday nutrition and fitness tracking. Calorie and activity values shown in the product are estimates and are not medical measurements.',
      'TODO: Confirm the legal entity name that operates Trackwise and the effective date of this policy.',
    ],
  },
  {
    id: 'information-we-collect',
    title: '2. Information We Collect',
    paragraphs: [
      'Depending on how you use Trackwise, we may process:',
      'Account credentials and authentication data (for example email address used for sign-in, and authentication tokens managed by our auth provider).',
      'Profile information you provide (such as display name, height, sex, birth date, activity level, preferred units, appearance preferences, language, and optional avatar image URL).',
      'Nutrition and fitness records you create (food entries, custom foods, workouts, workout sets, templates, favorites, goals, onboarding/setup progress, and body measurements).',
      'Optional images you upload (food photos, profile avatars, or custom exercise images) when image upload is configured.',
      'Product lookup requests when you scan barcodes (Trackwise may query Open Food Facts to retrieve product nutrition information).',
      'Technical information needed to operate the service (such as device/app version information available to the app runtime). We do not currently operate a third-party analytics SDK in the reviewed application code.',
      'TODO: Confirm whether additional diagnostics, crash reporting, or analytics will be enabled before launch and update this section.',
    ],
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Information',
    paragraphs: [
      'We use information to provide and maintain Trackwise features: authentication, syncing your diary and workouts, calculating estimates against your goals, showing progress, and supporting account controls such as export and deletion.',
      'We may use contact details you voluntarily provide (for example on a future support or feedback channel) to respond to requests.',
      'We do not use your nutrition or workout data to provide medical diagnosis or treatment.',
    ],
  },
  {
    id: 'account-profile',
    title: '4. Account and Profile Information',
    paragraphs: [
      'Account authentication is provided through Supabase Auth. You may sign in with email and password (including email verification and recovery codes) or with supported social providers such as Google when enabled for your environment.',
      'Profile fields are stored in our database and associated with your authenticated user identity. Access to user-owned profile data is protected with Row Level Security (RLS) so that other users cannot read or modify your private records.',
    ],
  },
  {
    id: 'food-workout-data',
    title: '5. Food, Nutrition and Workout Data',
    paragraphs: [
      'Food diary entries, custom foods, goals, workouts, templates, exercise favorites, and related records are stored in Supabase Postgres and scoped to your account through RLS policies.',
      'Shared catalog content (for example system foods or system exercises) may be readable by authenticated users as part of the product catalog, separate from your private logs.',
      'Barcode scanning may contact Open Food Facts to retrieve product information. Matched products may be saved as foods linked to your account when you confirm and log them.',
    ],
  },
  {
    id: 'uploaded-images',
    title: '6. Uploaded Images',
    paragraphs: [
      'If image upload is configured, optional photos for foods, avatars, or custom exercises may be uploaded to Cloudinary using an unsigned upload preset. The app stores the resulting HTTPS URL with your record.',
      'Client-side size limits apply (currently 1 MB for user image uploads in the mobile app).',
      'TODO: Confirm Cloudinary account ownership, regions, retention, and any subprocessors to list publicly.',
    ],
  },
  {
    id: 'storage-providers',
    title: '7. Data Storage and Service Providers',
    paragraphs: [
      'Primary application data is stored using Supabase (authentication, Postgres database, and related backend services, including Edge Functions used for sensitive operations such as account deletion).',
      'System exercise images may be served from Supabase Storage. Optional user images may be stored with Cloudinary when configured.',
      'TODO: Confirm hosting regions, backup practices, and the full list of subprocessors for production.',
    ],
  },
  {
    id: 'sharing',
    title: '8. Data Sharing',
    paragraphs: [
      'We do not sell your personal information.',
      'We share data with service providers only as needed to operate Trackwise (for example auth/database hosting, optional image hosting, and Open Food Facts lookups you initiate by scanning).',
      'We may disclose information if required by law or to protect the rights, safety, and integrity of users and the service, where legally permitted.',
      'TODO: Confirm any additional sharing scenarios (affiliates, acquisitions) before publication.',
    ],
  },
  {
    id: 'retention',
    title: '9. Data Retention',
    paragraphs: [
      'We retain account and tracking data while your account remains active so the product can sync and display your history.',
      'You may export a backup, delete account data while keeping a login, or delete your account through in-app controls. Account deletion is processed through a server-side delete-account function.',
      'TODO: Confirm precise retention periods after deletion requests and for backups/logs.',
    ],
  },
  {
    id: 'security',
    title: '10. Security',
    paragraphs: [
      'We use industry-standard provider protections, including encrypted transport (HTTPS) and database access controls with Row Level Security for user-owned data.',
      'No method of transmission or storage is 100% secure. Please use a strong password and protect access to your devices.',
      'TODO: Confirm any additional security certifications or practices to disclose.',
    ],
  },
  {
    id: 'rights',
    title: '11. User Rights',
    paragraphs: [
      'Depending on your location, you may have rights to access, correct, export, or delete personal data. Trackwise provides in-app export, data deletion, and account deletion tools to help you exercise these controls.',
      'TODO: Confirm the contact channel and verification process for privacy requests, and any jurisdiction-specific rights notices (for example GDPR/CCPA) required for launch.',
    ],
  },
  {
    id: 'children',
    title: "12. Children's Privacy",
    paragraphs: [
      'Trackwise is not directed to children under 13 (or the equivalent minimum age in your country). During setup, safety prompts may route some users (including minors) toward manual calorie targets rather than automated estimates.',
      'TODO: Confirm the minimum age policy and parental consent approach for the published product.',
    ],
  },
  {
    id: 'changes',
    title: '13. Policy Changes',
    paragraphs: [
      'We may update this Privacy Policy as the product or legal requirements change. The updated version will be posted on this page with a revised date once finalized.',
      'TODO: Confirm how material changes will be communicated to users.',
    ],
  },
  {
    id: 'contact',
    title: '14. Contact Information',
    paragraphs: [
      'For privacy questions, contact us using the support channel published for Trackwise.',
      'TODO: Add the official privacy contact email and mailing address once confirmed.',
      'Website: https://trackwise.one',
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    paragraphs: [
      'By accessing trackwise.one or using the Trackwise mobile application, you agree to these Terms of Use. If you do not agree, do not use the service.',
      'TODO: Confirm governing entity name and effective date.',
    ],
  },
  {
    id: 'description',
    title: '2. Description of the Service',
    paragraphs: [
      'Trackwise is a consumer nutrition and fitness tracking product. Features may include food diary logging, barcode product lookup, workout logging, goals, body measurements, and progress views.',
      'Important: Trackwise provides everyday nutrition and activity tracking estimates. These estimates are not medical measurements and should not be treated as medical advice, diagnosis, or treatment.',
    ],
  },
  {
    id: 'registration',
    title: '3. Account Registration',
    paragraphs: [
      'Certain features require an account. You agree to provide accurate information and to keep your credentials confidential.',
      'You are responsible for activity under your account. Notify us promptly of unauthorized access through the published support channel once available.',
    ],
  },
  {
    id: 'responsibilities',
    title: '4. User Responsibilities',
    paragraphs: [
      'You are responsible for how you interpret and act on estimates shown in Trackwise.',
      'You should consult a qualified professional for medical, dietary, or training decisions that affect your health.',
    ],
  },
  {
    id: 'acceptable-use',
    title: '5. Acceptable Use',
    paragraphs: [
      'You agree not to misuse the service, including attempting unauthorized access, disrupting service availability, scraping beyond normal use, or uploading unlawful or harmful content.',
      'You agree not to reverse engineer the service except where such restriction is prohibited by law.',
    ],
  },
  {
    id: 'user-content',
    title: '6. User Content',
    paragraphs: [
      'You retain ownership of content you submit (such as custom foods, notes, images, and workout data). You grant Trackwise a limited license to host, process, and display that content solely to operate the service for you.',
      'You represent that you have the rights needed to submit content you upload.',
    ],
  },
  {
    id: 'payments',
    title: '7. Subscriptions and Payments',
    paragraphs: [
      'Core tracking features are currently offered without a paid subscription checkout in the reviewed application. Any future paid plans will be described in-product and in updated terms before charges apply.',
      'TODO: Confirm pricing, billing provider, refund policy, and trial terms before enabling paid features.',
    ],
  },
  {
    id: 'availability',
    title: '8. Service Availability',
    paragraphs: [
      'We aim to keep Trackwise available but do not guarantee uninterrupted operation. Features may change as the product evolves.',
      'Store availability for Android and iOS depends on publication status and platform approval.',
    ],
  },
  {
    id: 'ip',
    title: '9. Intellectual Property',
    paragraphs: [
      'Trackwise branding, product design, and software are owned by the Trackwise operator or its licensors. These Terms do not transfer ownership of that intellectual property to you.',
      'Third-party content (for example Open Food Facts product data or licensed fonts/assets) remains subject to its own terms.',
    ],
  },
  {
    id: 'disclaimers',
    title: '10. Disclaimers',
    paragraphs: [
      'THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, TO THE MAXIMUM EXTENT PERMITTED BY LAW.',
      'Trackwise does not warrant that estimates are accurate, complete, or suitable for any particular health purpose.',
      'TODO: Have counsel review warranty disclaimer language for your jurisdictions.',
    ],
  },
  {
    id: 'liability',
    title: '11. Limitation of Liability',
    paragraphs: [
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRACKWISE AND ITS OPERATORS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF DATA, PROFITS, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.',
      'TODO: Confirm liability caps and mandatory consumer protections that cannot be waived in your markets.',
    ],
  },
  {
    id: 'termination',
    title: '12. Termination',
    paragraphs: [
      'You may stop using Trackwise and delete your account through in-app controls.',
      'We may suspend or terminate access if you violate these Terms or if required to protect the service or other users.',
    ],
  },
  {
    id: 'changes-terms',
    title: '13. Changes to Terms',
    paragraphs: [
      'We may update these Terms. The updated version will be posted on this page once finalized. Continued use after the effective date constitutes acceptance where permitted by law.',
    ],
  },
  {
    id: 'governing-law',
    title: '14. Governing Law',
    paragraphs: [
      'TODO: Confirm governing law and venue. Do not assume a jurisdiction until the operator decides.',
      'Until confirmed, these Terms should be read as a draft framework only.',
    ],
  },
  {
    id: 'contact-terms',
    title: '15. Contact Information',
    paragraphs: [
      'Questions about these Terms can be sent through the Trackwise support channel once published.',
      'TODO: Add official contact email and mailing address.',
      'Website: https://trackwise.one',
    ],
  },
];
