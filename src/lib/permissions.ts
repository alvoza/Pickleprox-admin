/**
 * Role-based permission utilities for the admin portal.
 *
 * Roles:
 * - app_managers (Super Admin): Full access to everything
 * - court_owners (Court Manager): Manage assigned courts + create events
 * - group_admins (Group Admin): Manage assigned groups + create events
 */

export type AdminRole = 'app_managers' | 'court_owners' | 'group_admins';

interface UserPermissions {
  groups: string[];
  isSuperAdmin: boolean;
  isCourtManager: boolean;
  isGroupAdmin: boolean;
}

export function getUserPermissions(groups: string[]): UserPermissions {
  return {
    groups,
    isSuperAdmin: groups.includes('app_managers'),
    isCourtManager: groups.includes('court_owners'),
    isGroupAdmin: groups.includes('group_admins'),
  };
}

// Page visibility based on role
const PAGE_ACCESS: Record<string, (p: UserPermissions) => boolean> = {
  '/': () => true, // Dashboard - visible to all
  '/users': (p) => p.isSuperAdmin,
  '/courts': (p) => p.isSuperAdmin || p.isCourtManager,
  '/games': () => true, // Games - visible to all, data scoped by role
  '/tournaments': (p) => p.isSuperAdmin || p.isGroupAdmin,
  '/groups': (p) => p.isSuperAdmin || p.isGroupAdmin,
  '/tips': (p) => p.isSuperAdmin,
  '/notifications': (p) => p.isSuperAdmin,
};

export function canAccessPage(path: string, groups: string[]): boolean {
  const perms = getUserPermissions(groups);
  const check = PAGE_ACCESS[path];
  return check ? check(perms) : perms.isSuperAdmin;
}

export function getAccessiblePages(groups: string[]): string[] {
  const perms = getUserPermissions(groups);
  return Object.entries(PAGE_ACCESS)
    .filter(([, check]) => check(perms))
    .map(([path]) => path);
}
