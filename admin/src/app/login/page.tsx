import { getDictionary } from '@/i18n';
import { signIn } from '@/features/auth/actions';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const t = getDictionary();
  const params = await searchParams;
  const error =
    params.error === 'forbidden'
      ? t.login.errorForbidden
      : params.error === 'suspended'
        ? t.login.errorSuspended
        : params.error
          ? t.login.errorGeneric
          : null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-6 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 15% 10%, rgba(0,217,95,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(243,240,232,0.9), transparent 50%)',
        }}
      />
      <Card className="relative w-full max-w-md space-y-6 p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ash">
            Trackwise
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
            {t.login.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-mute">{t.login.subtitle}</p>
        </div>
        {error ? (
          <div className="rounded-[10px] border border-error/20 bg-[#fce8e8] px-3.5 py-2.5 text-sm text-error">
            {error}
          </div>
        ) : null}
        <form action={signIn} className="space-y-4">
          <div>
            <Label htmlFor="email">{t.login.email}</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div>
            <Label htmlFor="password">{t.login.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {t.login.submit}
          </Button>
        </form>
      </Card>
    </main>
  );
}
