/**
 * Role-based permission utilities for the admin portal.
 *
 * Roles:
 * - app_managers (Super Admin): Full access to everything
 * - court_owners (Court Manager): Manage assigned courts + create events
 * - group_admins (Group Admin): Manage assigned groups + create events
 * - tournament_admins (Tournament Admin): Manage tournaments, players CRM, calendar
 */

export type AdminRole = 'app_managers' | 'court_owners' | 'group_admins' | 'tournament_admins';

interface UserPermissions {
  groups: string[];
  isSuperAdmin: boolean;
  isCourtManager: boolean;
  isGroupAdmin: boolean;
  isTournamentAdmin: boolean;
}

export function getUserPermissions(groups: string[]): UserPermissions {
  return {
    groups,
    isSuperAdmin: groups.includes('app_managers'),
    isCourtManager: groups.includes('court_owners'),
    isGroupAdmin: groups.includes('group_admins'),
    isTournamentAdmin: groups.includes('tournament_admins'),
  };
}

// Page visibility based on role
const PAGE_ACCESS: Record<string, (p: UserPermissions) => boolean> = {
  '/': () => true, // Dashboard - visible to all
  '/users': (p) => p.isSuperAdmin,
  '/courts': (p) => p.isSuperAdmin || p.isCourtManager,
  '/games': (p) => p.isSuperAdmin || p.isCourtManager || p.isGroupAdmin,
  '/tournaments': (p) => p.isSuperAdmin || p.isGroupAdmin || p.isTournamentAdmin,
  '/tournament-players': (p) => p.isSuperAdmin || p.isTournamentAdmin || p.isGroupAdmin,
  '/calendar': (p) => p.isSuperAdmin || p.isTournamentAdmin || p.isGroupAdmin,
  '/groups': (p) => p.isSuperAdmin || p.isGroupAdmin,
  '/tips': (p) => p.isSuperAdmin,
  '/notifications': (p) => p.isSuperAdmin || p.isTournamentAdmin,
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
