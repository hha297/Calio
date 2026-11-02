import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { updateFeatureFlag } from '@/features/system/actions';
import { getDictionary } from '@/i18n';
import { createClient } from '@/lib/supabase/server';

export default async function FeatureFlagsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const t = getDictionary();
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from('feature_flags').select('*').order('key');

  return (
    <>
      <Topbar title={t.system.flagsTitle} />
      <div className="space-y-4 px-5 py-5">
        {params.saved ? (
          <Card className="border-primary/30 bg-primary/15 text-sm text-ink">Saved.</Card>
        ) : null}
        {params.error || error ? (
          <Card className="border-error/30 bg-error/10 text-sm text-error">
            {t.common.error}
          </Card>
        ) : null}
        {!data?.length ? (
          <Card className="text-sm text-ash">{t.common.empty}</Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.map((flag) => (
              <Card key={flag.key} className="space-y-3 p-4">
                <form action={updateFeatureFlag} className="space-y-3">
                  <input type="hidden" name="key" value={flag.key} />
                  <div>
                    <div className="font-mono-metric text-sm font-semibold text-ink">
                      {flag.key}
                    </div>
                    <p className="mt-1 text-sm text-mute">{flag.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Checkbox
                      name="enabled"
                      defaultChecked={flag.enabled}
                      label={t.system.enabled}
                    />
                    <Checkbox
                      name="tester_only"
                      defaultChecked={flag.tester_only}
                      label={t.system.testerOnly}
                    />
                  </div>
                  <Button type="submit" size="sm">
                    {t.common.save}
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
