import { describe, expect, it } from 'vitest';

/** Pure helpers mirroring last-admin guard intent used by RPCs / UI confirms. */
export function canRevokeAdmin(adminCount: number, targetIsAdmin: boolean): boolean {
  if (!targetIsAdmin) return true;
  return adminCount > 1;
}

export function rolesIncludeAdmin(roles: string[]): boolean {
  return roles.includes('admin');
}

describe('admin authz helpers', () => {
  it('blocks revoking the last admin', () => {
    expect(canRevokeAdmin(1, true)).toBe(false);
    expect(canRevokeAdmin(2, true)).toBe(true);
    expect(canRevokeAdmin(1, false)).toBe(true);
  });

  it('detects admin role', () => {
    expect(rolesIncludeAdmin(['tester'])).toBe(false);
    expect(rolesIncludeAdmin(['admin', 'tester'])).toBe(true);
  });
});
