import {
  SITE_LEGAL_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
} from '@/config/site';

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

/** Effective date shown on Privacy and Terms. */
export const LEGAL_EFFECTIVE_DATE = '3 November 2026';

export const privacyNotice =
  'This Privacy Policy explains how Trackwise handles personal data for the Trackwise mobile app and trackwise.one.';

export const termsNotice =
  'These Terms of Use govern access to trackwise.one and the Trackwise mobile application.';

export const privacySections: LegalSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction',
    paragraphs: [
      'This Privacy Policy describes how Trackwise (“Trackwise,” “we,” “us,” or “our”) handles information when you use the Trackwise mobile application and the public website at trackwise.one.',
      'Trackwise provides everyday nutrition and fitness tracking. Calorie and activity values shown in the product are estimates and are not medical measurements.',
      `The operator of Trackwise is ${SITE_LEGAL_NAME}. This policy is effective as of ${LEGAL_EFFECTIVE_DATE}.`,
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
      'Technical and diagnostic information needed to operate and improve the service, including device and app version details, performance metrics, crash and error reports, and limited usage events that help us understand feature reliability. This may include data processed by our infrastructure providers and, when enabled, crash-reporting or analytics tooling.',
      'Information collected by app-store platforms (Google Play / Apple) under their own privacy policies when you download or update Trackwise.',
    ],
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Information',
    paragraphs: [
      'We use information to provide and maintain Trackwise features: authentication, syncing your diary and workouts, calculating estimates against your goals, showing progress, and supporting account controls such as export and deletion.',
      'We use diagnostics, crash reports, and limited analytics to keep the app stable, investigate bugs, measure reliability, and improve product quality.',
      'We may use contact details you provide (email or phone) to respond to support or privacy requests.',
      'We do not use your nutrition or workout data to provide medical diagnosis or treatment.',
      'Where the EU GDPR / UK GDPR applies, we rely on one or more of the following legal bases: performance of a contract (providing the account and tracking features you request); legitimate interests (securing the service, preventing abuse, and improving reliability in ways that do not override your rights); and consent where required (for example certain optional processing or device permissions).',
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
      'If image upload is configured, optional photos for foods, avatars, or custom exercises may be uploaded to Cloudinary using an unsigned upload preset operated for Trackwise. The app stores the resulting HTTPS URL with your record.',
      'Client-side size limits apply (currently 1 MB for user image uploads in the mobile app).',
      'Cloudinary processes image files as a service provider for Trackwise. Retention of image objects follows Cloudinary account settings and Trackwise deletion flows when you remove content or delete your account.',
    ],
  },
  {
    id: 'storage-providers',
    title: '7. Data Storage and Service Providers',
    paragraphs: [
      'Primary application data is stored using Supabase (authentication, Postgres database, and related backend services, including Edge Functions used for sensitive operations such as account deletion).',
      'System exercise images may be served from Supabase Storage. Optional user images may be stored with Cloudinary when configured.',
      'Hosting regions and backups follow the production configuration of these providers for the Trackwise project. Subprocessors currently used to operate the service include Supabase (auth, database, storage, functions), Cloudinary (optional user image hosting), and Open Food Facts (barcode product lookup you initiate). App-store platforms and device OS vendors may also process data under their policies.',
    ],
  },
  {
    id: 'sharing',
    title: '8. Data Sharing',
    paragraphs: [
      'We do not sell your personal information.',
      'We share data with service providers only as needed to operate Trackwise (for example auth/database hosting, optional image hosting, diagnostics/crash tooling when enabled, and Open Food Facts lookups you initiate by scanning).',
      'We may disclose information if required by law or to protect the rights, safety, and integrity of users and the service, where legally permitted.',
      'Trackwise does not operate an affiliate or partner-coach marketplace. We do not share your private diary or workout data with third-party coaches through the product.',
    ],
  },
  {
    id: 'retention',
    title: '9. Data Retention',
    paragraphs: [
      'We retain account and tracking data while your account remains active so the product can sync and display your history.',
      'You may export a backup, delete account data while keeping a login, or delete your account through in-app controls. Account deletion is processed through a server-side delete-account function.',
      'After a verified deletion request, we remove or anonymize active account data from production systems without undue delay. Residual copies in encrypted backups or logs are purged according to provider backup cycles, typically within 30 to 90 days, except where a longer retention is required by law or for security investigations.',
    ],
  },
  {
    id: 'security',
    title: '10. Security',
    paragraphs: [
      'We use industry-standard provider protections, including encrypted transport (HTTPS) and database access controls with Row Level Security for user-owned data.',
      'Access to operator tooling is limited to authorized personnel. No method of transmission or storage is 100% secure. Please use a strong password and protect access to your devices.',
    ],
  },
  {
    id: 'rights',
    title: '11. Your Rights (EEA/UK and United States)',
    paragraphs: [
      'Depending on where you live, you may have rights to access, correct, export, restrict, object to, or delete personal data, and to withdraw consent where processing is consent-based.',
      `Trackwise provides in-app export, data deletion, and account deletion tools to help you exercise these controls. You may also email ${SUPPORT_EMAIL} (or call ${SUPPORT_PHONE}) to submit a privacy request. We may need to verify your identity before fulfilling certain requests.`,
      'European Economic Area and United Kingdom (GDPR / UK GDPR): you may have the rights listed above and the right to lodge a complaint with your local supervisory authority. Where we rely on legitimate interests, you may object to that processing. Where we rely on consent, you may withdraw consent at any time without affecting prior lawful processing.',
      'California and other US state privacy laws (including CCPA/CPRA where applicable): you may have rights to know/access, delete, correct, and opt out of “sale” or “sharing” of personal information as those terms are defined by law. Trackwise does not sell personal information for money. If we use advertising or cross-context analytics that qualify as “sharing” under California law, you may opt out by contacting us. We will not discriminate against you for exercising privacy rights.',
      'We respond to verifiable consumer requests within the timeframes required by applicable law (generally within 30 to 45 days, with permitted extensions when needed).',
    ],
  },
  {
    id: 'children',
    title: "12. Children's Privacy",
    paragraphs: [
      'Trackwise is not directed to children under 13 (or the higher age required in your country, such as 16 in some EU member states where applicable). During setup, safety prompts may route some users toward manual calorie targets rather than automated estimates.',
      'We do not knowingly collect personal information from children below the applicable minimum age. If you believe a child has created an account, contact us and we will take appropriate steps to delete the information.',
    ],
  },
  {
    id: 'international',
    title: '13. International Transfers',
    paragraphs: [
      'Your information may be processed in countries where our service providers operate. Where required, we rely on appropriate safeguards such as Standard Contractual Clauses or the provider’s approved transfer mechanisms.',
    ],
  },
  {
    id: 'changes',
    title: '14. Policy Changes',
    paragraphs: [
      'We may update this Privacy Policy as the product or legal requirements change. The updated version will be posted on this page with a revised effective date.',
      'For material changes, we will provide additional notice where appropriate (for example an in-app notice or email to your account address).',
    ],
  },
  {
    id: 'contact',
    title: '15. Contact Information',
    paragraphs: [
      'Privacy and data-protection requests for Trackwise:',
      `Operator: ${SITE_LEGAL_NAME}`,
      `Email: ${SUPPORT_EMAIL}`,
      `Phone: ${SUPPORT_PHONE}`,
      `Website: ${SITE_URL}`,
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    paragraphs: [
      'By accessing trackwise.one or using the Trackwise mobile application, you agree to these Terms of Use. If you do not agree, do not use the service.',
      `These Terms are operated by ${SITE_LEGAL_NAME} and are effective as of ${LEGAL_EFFECTIVE_DATE}.`,
    ],
  },

  {
    id: 'description',
    title: '2. Description of the Service',
    paragraphs: [
      'Trackwise is a consumer nutrition and fitness tracking product. Features may include food diary logging, barcode product lookup, workout logging, goals, body measurements, and progress views.',
      'Important: Trackwise provides everyday nutrition and activity tracking estimates. These estimates are not medical measurements and should not be treated as medical advice, diagnosis, or treatment.',
      'Trackwise does not currently include coaching marketplace, personal trainer matching, or affiliate partner programs.',
    ],
  },
  {
    id: 'registration',
    title: '3. Account Registration',
    paragraphs: [
      'Certain features require an account. You agree to provide accurate information and to keep your credentials confidential.',
      `You are responsible for activity under your account. Notify us promptly of unauthorized access at ${SUPPORT_EMAIL} or ${SUPPORT_PHONE}.`,
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
      'Core tracking features are currently offered without a paid subscription checkout. If paid plans are introduced later, pricing, billing provider, refunds, and trials will be described in-product and in updated terms before charges apply.',
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
      'Trackwise branding, product design, and software are owned by Trackwise or its licensors. These Terms do not transfer ownership of that intellectual property to you.',
      'Third-party content (for example Open Food Facts product data or licensed fonts/assets) remains subject to its own terms.',
    ],
  },
  {
    id: 'disclaimers',
    title: '10. Disclaimers',
    paragraphs: [
      'THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, TO THE MAXIMUM EXTENT PERMITTED BY LAW.',
      'Trackwise does not warrant that estimates are accurate, complete, or suitable for any particular health purpose.',
      'Nothing in these Terms limits mandatory consumer warranties or rights that cannot be excluded under applicable law (including in the EEA/UK).',
    ],
  },
  {
    id: 'liability',
    title: '11. Limitation of Liability',
    paragraphs: [
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRACKWISE AND ITS OPERATORS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF DATA, PROFITS, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.',
      'Where liability cannot be excluded, our aggregate liability for claims relating to the service is limited to the greater of (a) the amounts you paid to Trackwise for the service in the 12 months before the claim, or (b) fifty euros (€50), except that this cap does not limit liability for death or personal injury caused by negligence, fraud, or any liability that cannot be limited by law.',
      'Mandatory consumer protections in your country of residence remain unaffected.',
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
      'We may update these Terms. The updated version will be posted on this page with a revised effective date. Continued use after the effective date constitutes acceptance where permitted by law.',
    ],
  },
  {
    id: 'governing-law',
    title: '14. Governing Law',
    paragraphs: [
      'These Terms are governed by the laws of Finland, without regard to conflict-of-law rules, except that consumers in the EEA/UK retain mandatory protections of their country of residence.',
      'Courts of Finland have non-exclusive jurisdiction, without prejudice to your right to bring proceedings in your local consumer courts where required by law.',
    ],
  },
  {
    id: 'contact-terms',
    title: '15. Contact Information',
    paragraphs: [
      'Questions about these Terms:',
      `Operator: ${SITE_LEGAL_NAME}`,
      `Email: ${SUPPORT_EMAIL}`,
      `Phone: ${SUPPORT_PHONE}`,
      `Website: ${SITE_URL}`,
    ],
  },
];
