import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { getDictionary } from '@/i18n';
import { createClient } from '@/lib/supabase/server';

export default async function AuditLogsPage() {
  const t = getDictionary();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select('id, actor_id, action, target_type, target_id, reason, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <>
      <Topbar title={t.system.auditTitle} />
      <div className="space-y-4 p-6">
        {error ? (
          <Card className="text-sm text-[#d64545]">{t.common.error}</Card>
        ) : !data?.length ? (
          <Card className="text-sm text-[#8d8d8d]">{t.common.empty}</Card>
        ) : (
          <Card className="overflow-hidden p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f3f0e8] text-[#646464]">
                <tr>
                  <th className="px-4 py-3">{t.system.when}</th>
                  <th className="px-4 py-3">{t.system.actor}</th>
                  <th className="px-4 py-3">{t.system.action}</th>
                  <th className="px-4 py-3">{t.system.target}</th>
                  <th className="px-4 py-3">{t.common.reason}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-t border-[#e4e0d8]">
                    <td className="px-4 py-3">{String(row.created_at).replace('T', ' ').slice(0, 19)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{row.actor_id ?? '—'}</td>
                    <td className="px-4 py-3">{row.action}</td>
                    <td className="px-4 py-3">
                      {row.target_type}
                      {row.target_id ? `:${row.target_id}` : ''}
                    </td>
                    <td className="px-4 py-3">{row.reason ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </>
  );
}
