import { Redirect } from 'expo-router';

/** Legacy tab route — Help now lives under the Account stack. */
export default function HelpTabRedirect() {
  return <Redirect href="/account/help" />;
}
