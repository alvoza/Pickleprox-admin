import type { ApiResponse } from './mock-data';
import type {
  TournamentCategory,
  TournamentPlayer,
  TournamentTeam,
  TournamentMatch,
  TournamentStanding,
} from '@/types/models';

// =============================================================================
// CRM PLAYERS — Liga Antigüeña de Pickleball III
// All unique players across the 5 categories (~54 unique people)
// =============================================================================

const mockTournamentPlayers: TournamentPlayer[] = [
  // cat1 - Dobles Principiante players
  { id: 'p1', name: 'Maynor', tournamentsPlayed: 2, createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p2', name: 'Edwin', tournamentsPlayed: 1, createdAt: '2026-02-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p3', name: 'Lindsey', email: 'lindsey@picklepro.app', tournamentsPlayed: 3, createdAt: '2025-11-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p4', name: 'Alejandra', tournamentsPlayed: 1, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p5', name: 'Ana Lucia', email: 'analucia@gmail.com', tournamentsPlayed: 2, createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p6', name: 'M.José', tournamentsPlayed: 1, createdAt: '2026-03-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p7', name: 'Julio', phone: '+502 5555-2007', tournamentsPlayed: 3, createdAt: '2025-10-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p8', name: 'Luis Arriola', tournamentsPlayed: 2, createdAt: '2026-01-05T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p9', name: 'Rafael', tournamentsPlayed: 1, createdAt: '2026-03-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p10', name: 'Kenneth', tournamentsPlayed: 1, createdAt: '2026-03-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p11', name: 'Santi', tournamentsPlayed: 2, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p12', name: 'Thomas', tournamentsPlayed: 1, createdAt: '2026-03-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p13', name: 'JC Silva', email: 'jcsilva@gmail.com', tournamentsPlayed: 3, createdAt: '2025-12-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p14', name: 'Estefany', tournamentsPlayed: 1, createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p15', name: 'Marlonn', tournamentsPlayed: 2, createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p16', name: 'Junior', tournamentsPlayed: 1, createdAt: '2026-03-25T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p17', name: 'Carlos L.', tournamentsPlayed: 2, createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p18', name: 'Josué', tournamentsPlayed: 1, createdAt: '2026-03-05T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p19', name: 'Gaël', tournamentsPlayed: 1, createdAt: '2026-04-05T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p20', name: 'Domenico', tournamentsPlayed: 1, createdAt: '2026-04-05T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p21', name: 'Andrea', tournamentsPlayed: 2, createdAt: '2026-02-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p22', name: 'Sergio', tournamentsPlayed: 1, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p23', name: 'César', phone: '+502 5555-2023', tournamentsPlayed: 3, createdAt: '2025-11-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p24', name: 'Abraham', tournamentsPlayed: 1, createdAt: '2026-03-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p25', name: 'Vaughan', tournamentsPlayed: 1, createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p26', name: 'Luisa', tournamentsPlayed: 1, createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },

  // cat2 - Dobles Intermedio players
  { id: 'p27', name: 'Marcelo', email: 'marcelo@gmail.com', tournamentsPlayed: 4, createdAt: '2025-10-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p28', name: 'Pablo V.', tournamentsPlayed: 2, createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p29', name: 'García', tournamentsPlayed: 2, createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p30', name: 'Bernal', tournamentsPlayed: 1, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p31', name: 'Mego', tournamentsPlayed: 3, createdAt: '2025-12-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p32', name: 'Nash', tournamentsPlayed: 2, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p33', name: 'Paul V.', tournamentsPlayed: 2, createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p34', name: 'Richard R.', tournamentsPlayed: 3, createdAt: '2025-11-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p35', name: 'Richard', tournamentsPlayed: 3, createdAt: '2025-11-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p36', name: 'Ivan', tournamentsPlayed: 1, createdAt: '2026-03-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p37', name: 'Soto', tournamentsPlayed: 2, createdAt: '2026-02-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p38', name: 'Vinicio', tournamentsPlayed: 2, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p39', name: 'JJosé', tournamentsPlayed: 2, createdAt: '2026-01-25T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p40', name: 'Jesús C.', tournamentsPlayed: 2, createdAt: '2026-01-25T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p41', name: 'Eddy', tournamentsPlayed: 3, createdAt: '2025-12-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p42', name: 'Christian C.', tournamentsPlayed: 2, createdAt: '2026-02-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p43', name: 'Arango', tournamentsPlayed: 3, createdAt: '2025-11-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p44', name: 'Corzo', tournamentsPlayed: 3, createdAt: '2025-11-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p45', name: 'Samuel', tournamentsPlayed: 2, createdAt: '2026-01-05T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p46', name: 'Diego', email: 'diego@picklepro.app', tournamentsPlayed: 4, createdAt: '2025-09-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p47', name: 'Miguel Á.', tournamentsPlayed: 3, createdAt: '2025-12-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p48', name: 'Daniel', tournamentsPlayed: 2, createdAt: '2026-02-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },

  // cat3 - Dobles Open players (some shared with cat2 via Corzo p44)
  { id: 'p49', name: 'LCarlos', tournamentsPlayed: 3, createdAt: '2025-12-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p50', name: 'Gamboa', tournamentsPlayed: 4, createdAt: '2025-10-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p51', name: 'Abel', tournamentsPlayed: 3, createdAt: '2025-12-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p52', name: 'Emilio', tournamentsPlayed: 2, createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p53', name: 'Wilson', tournamentsPlayed: 2, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p54', name: 'Tony Chang', tournamentsPlayed: 3, createdAt: '2025-11-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p55', name: 'Stephanie', tournamentsPlayed: 3, createdAt: '2025-12-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p56', name: 'Leiva', tournamentsPlayed: 2, createdAt: '2026-02-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p57', name: 'José Solé', email: 'jsole@gmail.com', tournamentsPlayed: 5, skillLevel: 'advanced', createdAt: '2025-08-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p58', name: 'Arnaud', tournamentsPlayed: 2, createdAt: '2026-01-25T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p59', name: 'Angel', tournamentsPlayed: 2, createdAt: '2026-02-05T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p60', name: 'Fabio', tournamentsPlayed: 1, createdAt: '2026-03-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p61', name: 'Carlos Rosales', email: 'crossales@gmail.com', tournamentsPlayed: 5, skillLevel: 'advanced', createdAt: '2025-08-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p62', name: 'Luis Buenahora', phone: '+502 5555-3062', tournamentsPlayed: 5, skillLevel: 'pro', createdAt: '2025-07-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p63', name: 'Paúl', tournamentsPlayed: 3, createdAt: '2025-11-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p64', name: 'Kevin', tournamentsPlayed: 2, createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p65', name: 'Michael', tournamentsPlayed: 3, createdAt: '2025-12-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p66', name: 'Christian', tournamentsPlayed: 3, createdAt: '2025-12-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p67', name: 'Chris Gwinner', email: 'cgwinner@gmail.com', tournamentsPlayed: 5, skillLevel: 'pro', createdAt: '2025-07-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p68', name: 'Hannah', tournamentsPlayed: 2, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },

  // cat4 - Singles A players (some shared: p62 Buenahora, p67 Gwinner, p66 Christian Chang, p57 Solé, p61 Rosales, p65 Michael Chang)
  { id: 'p69', name: 'Renato Westby', tournamentsPlayed: 4, skillLevel: 'pro', createdAt: '2025-09-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p70', name: 'Luis Carlos R.', tournamentsPlayed: 4, skillLevel: 'pro', createdAt: '2025-09-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p71', name: 'Michael Chang', tournamentsPlayed: 5, skillLevel: 'pro', createdAt: '2025-08-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p72', name: 'Christian Chang', tournamentsPlayed: 5, skillLevel: 'pro', createdAt: '2025-08-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },

  // cat5 - Singles B players (some shared: p40 Jesús C.→Jesús Mora, p39 JJosé→Juan José Ordoñez, p42 Christian C.→Christian Cullo, etc.)
  { id: 'p73', name: 'Jesús Mora', tournamentsPlayed: 3, skillLevel: 'intermediate', createdAt: '2025-11-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p74', name: 'Juan José Ordoñez', tournamentsPlayed: 3, skillLevel: 'intermediate', createdAt: '2025-11-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p75', name: 'Christian Cullo', tournamentsPlayed: 2, skillLevel: 'intermediate', createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p76', name: 'Carlos La Fuente', tournamentsPlayed: 2, skillLevel: 'intermediate', createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p77', name: 'Estuardo Rosales', tournamentsPlayed: 3, skillLevel: 'intermediate', createdAt: '2025-12-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p78', name: 'Richard Rivera', tournamentsPlayed: 3, skillLevel: 'intermediate', createdAt: '2025-11-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p79', name: 'Roberto Gamboa', tournamentsPlayed: 4, skillLevel: 'intermediate', createdAt: '2025-10-20T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p80', name: 'Danilo González', tournamentsPlayed: 2, skillLevel: 'intermediate', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p81', name: 'Mac Philips', tournamentsPlayed: 2, skillLevel: 'intermediate', createdAt: '2026-02-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p82', name: 'Vinicio Rosales', tournamentsPlayed: 3, skillLevel: 'intermediate', createdAt: '2025-12-15T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'p83', name: 'RC Arango', tournamentsPlayed: 3, skillLevel: 'intermediate', createdAt: '2025-11-10T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
];

// =============================================================================
// CATEGORIES — Liga Antigüeña de Pickleball III (5 categories)
// =============================================================================

const mockCategories: TournamentCategory[] = [
  {
    id: 'cat1',
    tournamentId: 't1',
    name: 'Dobles COED Principiante',
    format: 'round_robin',
    matchType: 'doubles',
    skillLevel: 'beginner',
    duprRange: '<3.0',
    maxTeams: 13,
    currentTeams: 13,
    status: 'in_progress',
    qualifyCount: 4,
    order: 1,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-18T00:00:00Z',
  },
  {
    id: 'cat2',
    tournamentId: 't1',
    name: 'Dobles COED Intermedio',
    format: 'round_robin',
    matchType: 'doubles',
    skillLevel: 'intermediate',
    duprRange: '<3.7',
    maxTeams: 11,
    currentTeams: 11,
    status: 'in_progress',
    qualifyCount: 4,
    order: 2,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-18T00:00:00Z',
  },
  {
    id: 'cat3',
    tournamentId: 't1',
    name: 'Dobles COED Open',
    format: 'round_robin',
    matchType: 'doubles',
    skillLevel: 'advanced',
    maxTeams: 11,
    currentTeams: 11,
    status: 'in_progress',
    qualifyCount: 4,
    order: 3,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-18T00:00:00Z',
  },
  {
    id: 'cat4',
    tournamentId: 't1',
    name: 'Singles Masculino A',
    format: 'round_robin',
    matchType: 'singles',
    skillLevel: 'pro',
    maxTeams: 8,
    currentTeams: 8,
    status: 'setup',
    order: 4,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-15T00:00:00Z',
  },
  {
    id: 'cat5',
    tournamentId: 't1',
    name: 'Singles Masculino B',
    format: 'round_robin',
    matchType: 'singles',
    skillLevel: 'intermediate',
    maxTeams: 11,
    currentTeams: 11,
    status: 'setup',
    order: 5,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-15T00:00:00Z',
  },
];

// =============================================================================
// TEAMS
// =============================================================================

// cat1: 13 doubles teams (Principiante)
const cat1Teams: TournamentTeam[] = [
  { id: 't1_1', name: 'Maynor/Edwin', players: [{ id: 'p1', name: 'Maynor' }, { id: 'p2', name: 'Edwin' }], categoryId: 'cat1', tournamentId: 't1', seed: 1 },
  { id: 't1_2', name: 'Linsdey/Alejandra', players: [{ id: 'p3', name: 'Lindsey' }, { id: 'p4', name: 'Alejandra' }], categoryId: 'cat1', tournamentId: 't1', seed: 2 },
  { id: 't1_3', name: 'Ana Lucia/M.José', players: [{ id: 'p5', name: 'Ana Lucia' }, { id: 'p6', name: 'M.José' }], categoryId: 'cat1', tournamentId: 't1', seed: 3 },
  { id: 't1_4', name: 'Julio/Luis Arriola', players: [{ id: 'p7', name: 'Julio' }, { id: 'p8', name: 'Luis Arriola' }], categoryId: 'cat1', tournamentId: 't1', seed: 4 },
  { id: 't1_5', name: 'Rafael/Kenneth', players: [{ id: 'p9', name: 'Rafael' }, { id: 'p10', name: 'Kenneth' }], categoryId: 'cat1', tournamentId: 't1', seed: 5 },
  { id: 't1_6', name: 'Santi/Thomas', players: [{ id: 'p11', name: 'Santi' }, { id: 'p12', name: 'Thomas' }], categoryId: 'cat1', tournamentId: 't1', seed: 6 },
  { id: 't1_7', name: 'JC Silva/Estefany', players: [{ id: 'p13', name: 'JC Silva' }, { id: 'p14', name: 'Estefany' }], categoryId: 'cat1', tournamentId: 't1', seed: 7 },
  { id: 't1_8', name: 'Marlonn/Junior', players: [{ id: 'p15', name: 'Marlonn' }, { id: 'p16', name: 'Junior' }], categoryId: 'cat1', tournamentId: 't1', seed: 8 },
  { id: 't1_9', name: 'Carlos L./Josué', players: [{ id: 'p17', name: 'Carlos L.' }, { id: 'p18', name: 'Josué' }], categoryId: 'cat1', tournamentId: 't1', seed: 9 },
  { id: 't1_10', name: 'Gaël/Domenico', players: [{ id: 'p19', name: 'Gaël' }, { id: 'p20', name: 'Domenico' }], categoryId: 'cat1', tournamentId: 't1', seed: 10 },
  { id: 't1_11', name: 'Andrea/Sergio', players: [{ id: 'p21', name: 'Andrea' }, { id: 'p22', name: 'Sergio' }], categoryId: 'cat1', tournamentId: 't1', seed: 11 },
  { id: 't1_12', name: 'César/Abraham', players: [{ id: 'p23', name: 'César' }, { id: 'p24', name: 'Abraham' }], categoryId: 'cat1', tournamentId: 't1', seed: 12 },
  { id: 't1_13', name: 'Vaughan/Luisa', players: [{ id: 'p25', name: 'Vaughan' }, { id: 'p26', name: 'Luisa' }], categoryId: 'cat1', tournamentId: 't1', seed: 13 },
];

// cat2: 11 doubles teams (Intermedio)
const cat2Teams: TournamentTeam[] = [
  { id: 't2_1', name: 'Marcelo/Pablo V.', players: [{ id: 'p27', name: 'Marcelo' }, { id: 'p28', name: 'Pablo V.' }], categoryId: 'cat2', tournamentId: 't1', seed: 1 },
  { id: 't2_2', name: 'García/Bernal', players: [{ id: 'p29', name: 'García' }, { id: 'p30', name: 'Bernal' }], categoryId: 'cat2', tournamentId: 't1', seed: 2 },
  { id: 't2_3', name: 'Mego/Nash', players: [{ id: 'p31', name: 'Mego' }, { id: 'p32', name: 'Nash' }], categoryId: 'cat2', tournamentId: 't1', seed: 3 },
  { id: 't2_4', name: 'Paul V./Richard R.', players: [{ id: 'p33', name: 'Paul V.' }, { id: 'p34', name: 'Richard R.' }], categoryId: 'cat2', tournamentId: 't1', seed: 4 },
  { id: 't2_5', name: 'Richard/Ivan', players: [{ id: 'p35', name: 'Richard' }, { id: 'p36', name: 'Ivan' }], categoryId: 'cat2', tournamentId: 't1', seed: 5 },
  { id: 't2_6', name: 'Soto/Vinicio', players: [{ id: 'p37', name: 'Soto' }, { id: 'p38', name: 'Vinicio' }], categoryId: 'cat2', tournamentId: 't1', seed: 6 },
  { id: 't2_7', name: 'JJosé/Jesús C.', players: [{ id: 'p39', name: 'JJosé' }, { id: 'p40', name: 'Jesús C.' }], categoryId: 'cat2', tournamentId: 't1', seed: 7 },
  { id: 't2_8', name: 'Eddy/Christian C.', players: [{ id: 'p41', name: 'Eddy' }, { id: 'p42', name: 'Christian C.' }], categoryId: 'cat2', tournamentId: 't1', seed: 8 },
  { id: 't2_9', name: 'Arango/Corzo', players: [{ id: 'p43', name: 'Arango' }, { id: 'p44', name: 'Corzo' }], categoryId: 'cat2', tournamentId: 't1', seed: 9 },
  { id: 't2_10', name: 'Samuel/Diego', players: [{ id: 'p45', name: 'Samuel' }, { id: 'p46', name: 'Diego' }], categoryId: 'cat2', tournamentId: 't1', seed: 10 },
  { id: 't2_11', name: 'Miguel Á./Daniel', players: [{ id: 'p47', name: 'Miguel Á.' }, { id: 'p48', name: 'Daniel' }], categoryId: 'cat2', tournamentId: 't1', seed: 11 },
];

// cat3: 11 doubles teams (Open)
const cat3Teams: TournamentTeam[] = [
  { id: 't3_1', name: 'LCarlos/Corzo', players: [{ id: 'p49', name: 'LCarlos' }, { id: 'p44', name: 'Corzo' }], categoryId: 'cat3', tournamentId: 't1', seed: 1 },
  { id: 't3_2', name: 'Gamboa/Arriola', players: [{ id: 'p50', name: 'Gamboa' }, { id: 'p8', name: 'Luis Arriola' }], categoryId: 'cat3', tournamentId: 't1', seed: 2 },
  { id: 't3_3', name: 'Abel/Emilio', players: [{ id: 'p51', name: 'Abel' }, { id: 'p52', name: 'Emilio' }], categoryId: 'cat3', tournamentId: 't1', seed: 3 },
  { id: 't3_4', name: 'Wilson/Tony Chang', players: [{ id: 'p53', name: 'Wilson' }, { id: 'p54', name: 'Tony Chang' }], categoryId: 'cat3', tournamentId: 't1', seed: 4 },
  { id: 't3_5', name: 'Stephanie/Leiva', players: [{ id: 'p55', name: 'Stephanie' }, { id: 'p56', name: 'Leiva' }], categoryId: 'cat3', tournamentId: 't1', seed: 5 },
  { id: 't3_6', name: 'Solé/Arnaud', players: [{ id: 'p57', name: 'José Solé' }, { id: 'p58', name: 'Arnaud' }], categoryId: 'cat3', tournamentId: 't1', seed: 6 },
  { id: 't3_7', name: 'Angel/Fabio', players: [{ id: 'p59', name: 'Angel' }, { id: 'p60', name: 'Fabio' }], categoryId: 'cat3', tournamentId: 't1', seed: 7 },
  { id: 't3_8', name: 'CRosales/Buenahora', players: [{ id: 'p61', name: 'Carlos Rosales' }, { id: 'p62', name: 'Luis Buenahora' }], categoryId: 'cat3', tournamentId: 't1', seed: 8 },
  { id: 't3_9', name: 'Paúl/Kevin', players: [{ id: 'p63', name: 'Paúl' }, { id: 'p64', name: 'Kevin' }], categoryId: 'cat3', tournamentId: 't1', seed: 9 },
  { id: 't3_10', name: 'Michael/Christian', players: [{ id: 'p65', name: 'Michael' }, { id: 'p66', name: 'Christian' }], categoryId: 'cat3', tournamentId: 't1', seed: 10 },
  { id: 't3_11', name: 'Gwinner/Hannah', players: [{ id: 'p67', name: 'Chris Gwinner' }, { id: 'p68', name: 'Hannah' }], categoryId: 'cat3', tournamentId: 't1', seed: 11 },
];

// cat4: 8 singles players (Singles Masculino A)
const cat4Teams: TournamentTeam[] = [
  { id: 't4_1', name: 'Luis Buenahora', players: [{ id: 'p62', name: 'Luis Buenahora' }], categoryId: 'cat4', tournamentId: 't1', seed: 1 },
  { id: 't4_2', name: 'Chris Gwinner', players: [{ id: 'p67', name: 'Chris Gwinner' }], categoryId: 'cat4', tournamentId: 't1', seed: 2 },
  { id: 't4_3', name: 'Christian Chang', players: [{ id: 'p72', name: 'Christian Chang' }], categoryId: 'cat4', tournamentId: 't1', seed: 3 },
  { id: 't4_4', name: 'José Solé', players: [{ id: 'p57', name: 'José Solé' }], categoryId: 'cat4', tournamentId: 't1', seed: 4 },
  { id: 't4_5', name: 'Renato Westby', players: [{ id: 'p69', name: 'Renato Westby' }], categoryId: 'cat4', tournamentId: 't1', seed: 5 },
  { id: 't4_6', name: 'Luis Carlos R.', players: [{ id: 'p70', name: 'Luis Carlos R.' }], categoryId: 'cat4', tournamentId: 't1', seed: 6 },
  { id: 't4_7', name: 'Carlos Rosales', players: [{ id: 'p61', name: 'Carlos Rosales' }], categoryId: 'cat4', tournamentId: 't1', seed: 7 },
  { id: 't4_8', name: 'Michael Chang', players: [{ id: 'p71', name: 'Michael Chang' }], categoryId: 'cat4', tournamentId: 't1', seed: 8 },
];

// cat5: 11 singles players (Singles Masculino B)
const cat5Teams: TournamentTeam[] = [
  { id: 't5_1', name: 'Jesús Mora', players: [{ id: 'p73', name: 'Jesús Mora' }], categoryId: 'cat5', tournamentId: 't1', seed: 1 },
  { id: 't5_2', name: 'Juan José Ordoñez', players: [{ id: 'p74', name: 'Juan José Ordoñez' }], categoryId: 'cat5', tournamentId: 't1', seed: 2 },
  { id: 't5_3', name: 'Christian Cullo', players: [{ id: 'p75', name: 'Christian Cullo' }], categoryId: 'cat5', tournamentId: 't1', seed: 3 },
  { id: 't5_4', name: 'Carlos La Fuente', players: [{ id: 'p76', name: 'Carlos La Fuente' }], categoryId: 'cat5', tournamentId: 't1', seed: 4 },
  { id: 't5_5', name: 'Estuardo Rosales', players: [{ id: 'p77', name: 'Estuardo Rosales' }], categoryId: 'cat5', tournamentId: 't1', seed: 5 },
  { id: 't5_6', name: 'Richard Rivera', players: [{ id: 'p78', name: 'Richard Rivera' }], categoryId: 'cat5', tournamentId: 't1', seed: 6 },
  { id: 't5_7', name: 'Roberto Gamboa', players: [{ id: 'p79', name: 'Roberto Gamboa' }], categoryId: 'cat5', tournamentId: 't1', seed: 7 },
  { id: 't5_8', name: 'Danilo González', players: [{ id: 'p80', name: 'Danilo González' }], categoryId: 'cat5', tournamentId: 't1', seed: 8 },
  { id: 't5_9', name: 'Mac Philips', players: [{ id: 'p81', name: 'Mac Philips' }], categoryId: 'cat5', tournamentId: 't1', seed: 9 },
  { id: 't5_10', name: 'Vinicio Rosales', players: [{ id: 'p82', name: 'Vinicio Rosales' }], categoryId: 'cat5', tournamentId: 't1', seed: 10 },
  { id: 't5_11', name: 'RC Arango', players: [{ id: 'p83', name: 'RC Arango' }], categoryId: 'cat5', tournamentId: 't1', seed: 11 },
];

const allTeams: Record<string, TournamentTeam[]> = {
  cat1: cat1Teams,
  cat2: cat2Teams,
  cat3: cat3Teams,
  cat4: cat4Teams,
  cat5: cat5Teams,
};

// =============================================================================
// MATCHES — Jornada 1 (Round 1)
// =============================================================================

// cat1 - Dobles Principiante (24 matches, all round 1, all completed)
const cat1Matches: TournamentMatch[] = [
  { id: 'm1_1', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 1, teamA: { id: 't1_1', name: 'Maynor/Edwin' }, teamB: { id: 't1_2', name: 'Linsdey/Alejandra' }, scoreA: 13, scoreB: 15, status: 'completed', winnerId: 't1_2' },
  { id: 'm1_2', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 2, teamA: { id: 't1_3', name: 'Ana Lucia/M.José' }, teamB: { id: 't1_4', name: 'Julio/Luis Arriola' }, scoreA: 2, scoreB: 15, status: 'completed', winnerId: 't1_4' },
  { id: 'm1_3', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 3, teamA: { id: 't1_5', name: 'Rafael/Kenneth' }, teamB: { id: 't1_6', name: 'Santi/Thomas' }, scoreA: 15, scoreB: 13, status: 'completed', winnerId: 't1_5' },
  { id: 'm1_4', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 4, teamA: { id: 't1_7', name: 'JC Silva/Estefany' }, teamB: { id: 't1_8', name: 'Marlonn/Junior' }, scoreA: 5, scoreB: 15, status: 'completed', winnerId: 't1_8' },
  { id: 'm1_5', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 5, teamA: { id: 't1_9', name: 'Carlos L./Josué' }, teamB: { id: 't1_10', name: 'Gaël/Domenico' }, scoreA: 15, scoreB: 4, status: 'completed', winnerId: 't1_9' },
  { id: 'm1_6', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 6, teamA: { id: 't1_11', name: 'Andrea/Sergio' }, teamB: { id: 't1_12', name: 'César/Abraham' }, scoreA: 8, scoreB: 15, status: 'completed', winnerId: 't1_12' },
  { id: 'm1_7', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 7, teamA: { id: 't1_5', name: 'Rafael/Kenneth' }, teamB: { id: 't1_2', name: 'Linsdey/Alejandra' }, scoreA: 15, scoreB: 13, status: 'completed', winnerId: 't1_5' },
  { id: 'm1_8', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 8, teamA: { id: 't1_13', name: 'Vaughan/Luisa' }, teamB: { id: 't1_4', name: 'Julio/Luis Arriola' }, scoreA: 0, scoreB: 1, status: 'completed', winnerId: 't1_4' },
  { id: 'm1_9', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 9, teamA: { id: 't1_3', name: 'Ana Lucia/M.José' }, teamB: { id: 't1_8', name: 'Marlonn/Junior' }, scoreA: 6, scoreB: 15, status: 'completed', winnerId: 't1_8' },
  { id: 'm1_10', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 10, teamA: { id: 't1_7', name: 'JC Silva/Estefany' }, teamB: { id: 't1_10', name: 'Gaël/Domenico' }, scoreA: 15, scoreB: 11, status: 'completed', winnerId: 't1_7' },
  { id: 'm1_11', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 11, teamA: { id: 't1_1', name: 'Maynor/Edwin' }, teamB: { id: 't1_12', name: 'César/Abraham' }, scoreA: 14, scoreB: 15, status: 'completed', winnerId: 't1_12' },
  { id: 'm1_12', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 12, teamA: { id: 't1_9', name: 'Carlos L./Josué' }, teamB: { id: 't1_11', name: 'Andrea/Sergio' }, scoreA: 15, scoreB: 7, status: 'completed', winnerId: 't1_9' },
  { id: 'm1_13', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 13, teamA: { id: 't1_6', name: 'Santi/Thomas' }, teamB: { id: 't1_2', name: 'Linsdey/Alejandra' }, scoreA: 4, scoreB: 15, status: 'completed', winnerId: 't1_2' },
  { id: 'm1_14', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 14, teamA: { id: 't1_13', name: 'Vaughan/Luisa' }, teamB: { id: 't1_8', name: 'Marlonn/Junior' }, scoreA: 0, scoreB: 1, status: 'completed', winnerId: 't1_8' },
  { id: 'm1_15', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 15, teamA: { id: 't1_4', name: 'Julio/Luis Arriola' }, teamB: { id: 't1_10', name: 'Gaël/Domenico' }, scoreA: 15, scoreB: 1, status: 'completed', winnerId: 't1_4' },
  { id: 'm1_16', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 16, teamA: { id: 't1_3', name: 'Ana Lucia/M.José' }, teamB: { id: 't1_11', name: 'Andrea/Sergio' }, scoreA: 14, scoreB: 15, status: 'completed', winnerId: 't1_11' },
  { id: 'm1_17', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 17, teamA: { id: 't1_5', name: 'Rafael/Kenneth' }, teamB: { id: 't1_9', name: 'Carlos L./Josué' }, scoreA: 13, scoreB: 15, status: 'completed', winnerId: 't1_9' },
  { id: 'm1_18', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 18, teamA: { id: 't1_7', name: 'JC Silva/Estefany' }, teamB: { id: 't1_1', name: 'Maynor/Edwin' }, scoreA: 9, scoreB: 15, status: 'completed', winnerId: 't1_1' },
  { id: 'm1_19', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 19, teamA: { id: 't1_13', name: 'Vaughan/Luisa' }, teamB: { id: 't1_6', name: 'Santi/Thomas' }, scoreA: 0, scoreB: 1, status: 'completed', winnerId: 't1_6' },
  { id: 'm1_20', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 20, teamA: { id: 't1_4', name: 'Julio/Luis Arriola' }, teamB: { id: 't1_8', name: 'Marlonn/Junior' }, scoreA: 15, scoreB: 8, status: 'completed', winnerId: 't1_4' },
  { id: 'm1_21', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 21, teamA: { id: 't1_3', name: 'Ana Lucia/M.José' }, teamB: { id: 't1_10', name: 'Gaël/Domenico' }, scoreA: 12, scoreB: 15, status: 'completed', winnerId: 't1_10' },
  { id: 'm1_22', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 22, teamA: { id: 't1_5', name: 'Rafael/Kenneth' }, teamB: { id: 't1_12', name: 'César/Abraham' }, scoreA: 6, scoreB: 15, status: 'completed', winnerId: 't1_12' },
  { id: 'm1_23', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 23, teamA: { id: 't1_7', name: 'JC Silva/Estefany' }, teamB: { id: 't1_11', name: 'Andrea/Sergio' }, scoreA: 15, scoreB: 7, status: 'completed', winnerId: 't1_7' },
  { id: 'm1_24', tournamentId: 't1', categoryId: 'cat1', round: 1, matchNumber: 24, teamA: { id: 't1_1', name: 'Maynor/Edwin' }, teamB: { id: 't1_9', name: 'Carlos L./Josué' }, scoreA: 6, scoreB: 15, status: 'completed', winnerId: 't1_9' },
];

// cat2 - Dobles Intermedio (20 matches, all round 1, all completed)
const cat2Matches: TournamentMatch[] = [
  { id: 'm2_1', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 1, teamA: { id: 't2_1', name: 'Marcelo/Pablo V.' }, teamB: { id: 't2_2', name: 'García/Bernal' }, scoreA: 11, scoreB: 2, status: 'completed', winnerId: 't2_1' },
  { id: 'm2_2', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 2, teamA: { id: 't2_3', name: 'Mego/Nash' }, teamB: { id: 't2_4', name: 'Paul V./Richard R.' }, scoreA: 11, scoreB: 8, status: 'completed', winnerId: 't2_3' },
  { id: 'm2_3', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 3, teamA: { id: 't2_5', name: 'Richard/Ivan' }, teamB: { id: 't2_6', name: 'Soto/Vinicio' }, scoreA: 3, scoreB: 11, status: 'completed', winnerId: 't2_6' },
  { id: 'm2_4', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 4, teamA: { id: 't2_7', name: 'JJosé/Jesús C.' }, teamB: { id: 't2_8', name: 'Eddy/Christian C.' }, scoreA: 6, scoreB: 11, status: 'completed', winnerId: 't2_8' },
  { id: 'm2_5', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 5, teamA: { id: 't2_9', name: 'Arango/Corzo' }, teamB: { id: 't2_10', name: 'Samuel/Diego' }, scoreA: 9, scoreB: 11, status: 'completed', winnerId: 't2_10' },
  { id: 'm2_6', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 6, teamA: { id: 't2_11', name: 'Miguel Á./Daniel' }, teamB: { id: 't2_2', name: 'García/Bernal' }, scoreA: 11, scoreB: 0, status: 'completed', winnerId: 't2_11' },
  { id: 'm2_7', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 7, teamA: { id: 't2_1', name: 'Marcelo/Pablo V.' }, teamB: { id: 't2_6', name: 'Soto/Vinicio' }, scoreA: 11, scoreB: 4, status: 'completed', winnerId: 't2_1' },
  { id: 'm2_8', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 8, teamA: { id: 't2_3', name: 'Mego/Nash' }, teamB: { id: 't2_8', name: 'Eddy/Christian C.' }, scoreA: 8, scoreB: 11, status: 'completed', winnerId: 't2_8' },
  { id: 'm2_9', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 9, teamA: { id: 't2_5', name: 'Richard/Ivan' }, teamB: { id: 't2_10', name: 'Samuel/Diego' }, scoreA: 2, scoreB: 11, status: 'completed', winnerId: 't2_10' },
  { id: 'm2_10', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 10, teamA: { id: 't2_7', name: 'JJosé/Jesús C.' }, teamB: { id: 't2_9', name: 'Arango/Corzo' }, scoreA: 6, scoreB: 11, status: 'completed', winnerId: 't2_9' },
  { id: 'm2_11', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 11, teamA: { id: 't2_11', name: 'Miguel Á./Daniel' }, teamB: { id: 't2_4', name: 'Paul V./Richard R.' }, scoreA: 11, scoreB: 3, status: 'completed', winnerId: 't2_11' },
  { id: 'm2_12', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 12, teamA: { id: 't2_2', name: 'García/Bernal' }, teamB: { id: 't2_6', name: 'Soto/Vinicio' }, scoreA: 2, scoreB: 11, status: 'completed', winnerId: 't2_6' },
  { id: 'm2_13', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 13, teamA: { id: 't2_1', name: 'Marcelo/Pablo V.' }, teamB: { id: 't2_10', name: 'Samuel/Diego' }, scoreA: 8, scoreB: 11, status: 'completed', winnerId: 't2_10' },
  { id: 'm2_14', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 14, teamA: { id: 't2_3', name: 'Mego/Nash' }, teamB: { id: 't2_9', name: 'Arango/Corzo' }, scoreA: 7, scoreB: 11, status: 'completed', winnerId: 't2_9' },
  { id: 'm2_15', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 15, teamA: { id: 't2_5', name: 'Richard/Ivan' }, teamB: { id: 't2_7', name: 'JJosé/Jesús C.' }, scoreA: 4, scoreB: 11, status: 'completed', winnerId: 't2_7' },
  { id: 'm2_16', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 16, teamA: { id: 't2_11', name: 'Miguel Á./Daniel' }, teamB: { id: 't2_6', name: 'Soto/Vinicio' }, scoreA: 11, scoreB: 9, status: 'completed', winnerId: 't2_11' },
  { id: 'm2_17', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 17, teamA: { id: 't2_4', name: 'Paul V./Richard R.' }, teamB: { id: 't2_8', name: 'Eddy/Christian C.' }, scoreA: 9, scoreB: 11, status: 'completed', winnerId: 't2_8' },
  { id: 'm2_18', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 18, teamA: { id: 't2_2', name: 'García/Bernal' }, teamB: { id: 't2_10', name: 'Samuel/Diego' }, scoreA: 3, scoreB: 11, status: 'completed', winnerId: 't2_10' },
  { id: 'm2_19', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 19, teamA: { id: 't2_1', name: 'Marcelo/Pablo V.' }, teamB: { id: 't2_7', name: 'JJosé/Jesús C.' }, scoreA: 11, scoreB: 10, status: 'completed', winnerId: 't2_1' },
  { id: 'm2_20', tournamentId: 't1', categoryId: 'cat2', round: 1, matchNumber: 20, teamA: { id: 't2_3', name: 'Mego/Nash' }, teamB: { id: 't2_5', name: 'Richard/Ivan' }, scoreA: 11, scoreB: 7, status: 'completed', winnerId: 't2_3' },
];

// cat3 - Dobles Open (20 matches, all round 1, all completed)
const cat3Matches: TournamentMatch[] = [
  { id: 'm3_1', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 1, teamA: { id: 't3_1', name: 'LCarlos/Corzo' }, teamB: { id: 't3_2', name: 'Gamboa/Arriola' }, scoreA: 9, scoreB: 15, status: 'completed', winnerId: 't3_2' },
  { id: 'm3_2', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 2, teamA: { id: 't3_3', name: 'Abel/Emilio' }, teamB: { id: 't3_4', name: 'Wilson/Tony Chang' }, scoreA: 1, scoreB: 0, status: 'completed', winnerId: 't3_3' },
  { id: 'm3_3', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 3, teamA: { id: 't3_5', name: 'Stephanie/Leiva' }, teamB: { id: 't3_6', name: 'Solé/Arnaud' }, scoreA: 15, scoreB: 11, status: 'completed', winnerId: 't3_5' },
  { id: 'm3_4', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 4, teamA: { id: 't3_7', name: 'Angel/Fabio' }, teamB: { id: 't3_8', name: 'CRosales/Buenahora' }, scoreA: 2, scoreB: 15, status: 'completed', winnerId: 't3_8' },
  { id: 'm3_5', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 5, teamA: { id: 't3_9', name: 'Paúl/Kevin' }, teamB: { id: 't3_10', name: 'Michael/Christian' }, scoreA: 12, scoreB: 15, status: 'completed', winnerId: 't3_10' },
  { id: 'm3_6', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 6, teamA: { id: 't3_1', name: 'LCarlos/Corzo' }, teamB: { id: 't3_10', name: 'Michael/Christian' }, scoreA: 1, scoreB: 15, status: 'completed', winnerId: 't3_10' },
  { id: 'm3_7', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 7, teamA: { id: 't3_11', name: 'Gwinner/Hannah' }, teamB: { id: 't3_4', name: 'Wilson/Tony Chang' }, scoreA: 1, scoreB: 0, status: 'completed', winnerId: 't3_11' },
  { id: 'm3_8', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 8, teamA: { id: 't3_3', name: 'Abel/Emilio' }, teamB: { id: 't3_2', name: 'Gamboa/Arriola' }, scoreA: 15, scoreB: 4, status: 'completed', winnerId: 't3_3' },
  { id: 'm3_9', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 9, teamA: { id: 't3_5', name: 'Stephanie/Leiva' }, teamB: { id: 't3_8', name: 'CRosales/Buenahora' }, scoreA: 8, scoreB: 15, status: 'completed', winnerId: 't3_8' },
  { id: 'm3_10', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 10, teamA: { id: 't3_7', name: 'Angel/Fabio' }, teamB: { id: 't3_9', name: 'Paúl/Kevin' }, scoreA: 9, scoreB: 15, status: 'completed', winnerId: 't3_9' },
  { id: 'm3_11', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 11, teamA: { id: 't3_1', name: 'LCarlos/Corzo' }, teamB: { id: 't3_7', name: 'Angel/Fabio' }, scoreA: 5, scoreB: 15, status: 'completed', winnerId: 't3_7' },
  { id: 'm3_12', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 12, teamA: { id: 't3_11', name: 'Gwinner/Hannah' }, teamB: { id: 't3_6', name: 'Solé/Arnaud' }, scoreA: 2, scoreB: 15, status: 'completed', winnerId: 't3_6' },
  { id: 'm3_13', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 13, teamA: { id: 't3_4', name: 'Wilson/Tony Chang' }, teamB: { id: 't3_2', name: 'Gamboa/Arriola' }, scoreA: 0, scoreB: 1, status: 'completed', winnerId: 't3_2' },
  { id: 'm3_14', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 14, teamA: { id: 't3_3', name: 'Abel/Emilio' }, teamB: { id: 't3_10', name: 'Michael/Christian' }, scoreA: 15, scoreB: 11, status: 'completed', winnerId: 't3_3' },
  { id: 'm3_15', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 15, teamA: { id: 't3_5', name: 'Stephanie/Leiva' }, teamB: { id: 't3_9', name: 'Paúl/Kevin' }, scoreA: 10, scoreB: 15, status: 'completed', winnerId: 't3_9' },
  { id: 'm3_16', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 16, teamA: { id: 't3_5', name: 'Stephanie/Leiva' }, teamB: { id: 't3_1', name: 'LCarlos/Corzo' }, scoreA: 15, scoreB: 3, status: 'completed', winnerId: 't3_5' },
  { id: 'm3_17', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 17, teamA: { id: 't3_11', name: 'Gwinner/Hannah' }, teamB: { id: 't3_2', name: 'Gamboa/Arriola' }, scoreA: 15, scoreB: 10, status: 'completed', winnerId: 't3_11' },
  { id: 'm3_18', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 18, teamA: { id: 't3_6', name: 'Solé/Arnaud' }, teamB: { id: 't3_8', name: 'CRosales/Buenahora' }, scoreA: 11, scoreB: 15, status: 'completed', winnerId: 't3_8' },
  { id: 'm3_19', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 19, teamA: { id: 't3_4', name: 'Wilson/Tony Chang' }, teamB: { id: 't3_10', name: 'Michael/Christian' }, scoreA: 0, scoreB: 1, status: 'completed', winnerId: 't3_10' },
  { id: 'm3_20', tournamentId: 't1', categoryId: 'cat3', round: 1, matchNumber: 20, teamA: { id: 't3_3', name: 'Abel/Emilio' }, teamB: { id: 't3_7', name: 'Angel/Fabio' }, scoreA: 15, scoreB: 2, status: 'completed', winnerId: 't3_3' },
];

// cat4 and cat5 — no matches yet
const cat4Matches: TournamentMatch[] = [];
const cat5Matches: TournamentMatch[] = [];

const allMatches: Record<string, TournamentMatch[]> = {
  cat1: cat1Matches,
  cat2: cat2Matches,
  cat3: cat3Matches,
  cat4: cat4Matches,
  cat5: cat5Matches,
};

// =============================================================================
// STANDINGS
// =============================================================================

const cat1Standings: TournamentStanding[] = [
  { position: 1, teamId: 't1_12', teamName: 'César/Abraham', played: 5, won: 5, lost: 0, pointsFor: 75, pointsAgainst: 45, pointDiff: 30, winPct: 1.0 },
  { position: 2, teamId: 't1_4', teamName: 'Julio/Luis Arriola', played: 4, won: 4, lost: 0, pointsFor: 46, pointsAgainst: 11, pointDiff: 35, winPct: 1.0 },
  { position: 3, teamId: 't1_9', teamName: 'Carlos L./Josué', played: 4, won: 4, lost: 0, pointsFor: 60, pointsAgainst: 30, pointDiff: 30, winPct: 1.0 },
  { position: 4, teamId: 't1_8', teamName: 'Marlonn/Junior', played: 4, won: 3, lost: 1, pointsFor: 39, pointsAgainst: 26, pointDiff: 13, winPct: 0.75 },
  { position: 5, teamId: 't1_7', teamName: 'JC Silva/Estefany', played: 6, won: 3, lost: 3, pointsFor: 67, pointsAgainst: 77, pointDiff: -10, winPct: 0.5 },
  { position: 6, teamId: 't1_2', teamName: 'Linsdey/Alejandra', played: 3, won: 2, lost: 1, pointsFor: 43, pointsAgainst: 32, pointDiff: 11, winPct: 0.667 },
  { position: 7, teamId: 't1_5', teamName: 'Rafael/Kenneth', played: 5, won: 2, lost: 3, pointsFor: 63, pointsAgainst: 71, pointDiff: -8, winPct: 0.4 },
  { position: 8, teamId: 't1_1', teamName: 'Maynor/Edwin', played: 4, won: 1, lost: 3, pointsFor: 48, pointsAgainst: 54, pointDiff: -6, winPct: 0.25 },
  { position: 9, teamId: 't1_6', teamName: 'Santi/Thomas', played: 4, won: 1, lost: 3, pointsFor: 27, pointsAgainst: 45, pointDiff: -18, winPct: 0.25 },
  { position: 10, teamId: 't1_11', teamName: 'Andrea/Sergio', played: 4, won: 1, lost: 3, pointsFor: 37, pointsAgainst: 59, pointDiff: -22, winPct: 0.25 },
  { position: 11, teamId: 't1_10', teamName: 'Gaël/Domenico', played: 4, won: 1, lost: 3, pointsFor: 31, pointsAgainst: 57, pointDiff: -26, winPct: 0.25 },
  { position: 12, teamId: 't1_13', teamName: 'Vaughan/Luisa', played: 3, won: 0, lost: 3, pointsFor: 0, pointsAgainst: 3, pointDiff: -3, winPct: 0.0 },
  { position: 13, teamId: 't1_3', teamName: 'Ana Lucia/M.José', played: 4, won: 0, lost: 4, pointsFor: 34, pointsAgainst: 60, pointDiff: -26, winPct: 0.0 },
];

const cat2Standings: TournamentStanding[] = [
  { position: 1, teamId: 't2_10', teamName: 'Samuel/Diego', played: 4, won: 4, lost: 0, pointsFor: 44, pointsAgainst: 22, pointDiff: 22, winPct: 1.0 },
  { position: 2, teamId: 't2_11', teamName: 'Miguel Á./Daniel', played: 3, won: 3, lost: 0, pointsFor: 33, pointsAgainst: 12, pointDiff: 21, winPct: 1.0 },
  { position: 3, teamId: 't2_8', teamName: 'Eddy/Christian C.', played: 3, won: 3, lost: 0, pointsFor: 33, pointsAgainst: 23, pointDiff: 10, winPct: 1.0 },
  { position: 4, teamId: 't2_1', teamName: 'Marcelo/Pablo V.', played: 4, won: 3, lost: 1, pointsFor: 41, pointsAgainst: 27, pointDiff: 14, winPct: 0.75 },
  { position: 5, teamId: 't2_9', teamName: 'Arango/Corzo', played: 3, won: 2, lost: 1, pointsFor: 31, pointsAgainst: 24, pointDiff: 7, winPct: 0.667 },
  { position: 6, teamId: 't2_6', teamName: 'Soto/Vinicio', played: 4, won: 2, lost: 2, pointsFor: 35, pointsAgainst: 27, pointDiff: 8, winPct: 0.5 },
  { position: 7, teamId: 't2_3', teamName: 'Mego/Nash', played: 4, won: 2, lost: 2, pointsFor: 37, pointsAgainst: 37, pointDiff: 0, winPct: 0.5 },
  { position: 8, teamId: 't2_7', teamName: 'JJosé/Jesús C.', played: 4, won: 1, lost: 3, pointsFor: 33, pointsAgainst: 37, pointDiff: -4, winPct: 0.25 },
  { position: 9, teamId: 't2_4', teamName: 'Paul V./Richard R.', played: 3, won: 0, lost: 3, pointsFor: 20, pointsAgainst: 33, pointDiff: -13, winPct: 0.0 },
  { position: 10, teamId: 't2_5', teamName: 'Richard/Ivan', played: 4, won: 0, lost: 4, pointsFor: 16, pointsAgainst: 44, pointDiff: -28, winPct: 0.0 },
  { position: 11, teamId: 't2_2', teamName: 'García/Bernal', played: 4, won: 0, lost: 4, pointsFor: 7, pointsAgainst: 44, pointDiff: -37, winPct: 0.0 },
];

const cat3Standings: TournamentStanding[] = [
  { position: 1, teamId: 't3_3', teamName: 'Abel/Emilio', played: 4, won: 4, lost: 0, pointsFor: 46, pointsAgainst: 17, pointDiff: 29, winPct: 1.0 },
  { position: 2, teamId: 't3_8', teamName: 'CRosales/Buenahora', played: 3, won: 3, lost: 0, pointsFor: 45, pointsAgainst: 21, pointDiff: 24, winPct: 1.0 },
  { position: 3, teamId: 't3_10', teamName: 'Michael/Christian', played: 4, won: 3, lost: 1, pointsFor: 42, pointsAgainst: 28, pointDiff: 14, winPct: 0.75 },
  { position: 4, teamId: 't3_9', teamName: 'Paúl/Kevin', played: 3, won: 2, lost: 1, pointsFor: 42, pointsAgainst: 34, pointDiff: 8, winPct: 0.667 },
  { position: 5, teamId: 't3_11', teamName: 'Gwinner/Hannah', played: 3, won: 2, lost: 1, pointsFor: 18, pointsAgainst: 25, pointDiff: -7, winPct: 0.667 },
  { position: 6, teamId: 't3_5', teamName: 'Stephanie/Leiva', played: 4, won: 2, lost: 2, pointsFor: 48, pointsAgainst: 44, pointDiff: 4, winPct: 0.5 },
  { position: 7, teamId: 't3_2', teamName: 'Gamboa/Arriola', played: 4, won: 2, lost: 2, pointsFor: 30, pointsAgainst: 39, pointDiff: -9, winPct: 0.5 },
  { position: 8, teamId: 't3_6', teamName: 'Solé/Arnaud', played: 3, won: 1, lost: 2, pointsFor: 37, pointsAgainst: 32, pointDiff: 5, winPct: 0.333 },
  { position: 9, teamId: 't3_7', teamName: 'Angel/Fabio', played: 4, won: 1, lost: 3, pointsFor: 28, pointsAgainst: 50, pointDiff: -22, winPct: 0.25 },
  { position: 10, teamId: 't3_4', teamName: 'Wilson/Tony Chang', played: 4, won: 0, lost: 4, pointsFor: 0, pointsAgainst: 4, pointDiff: -4, winPct: 0.0 },
  { position: 11, teamId: 't3_1', teamName: 'LCarlos/Corzo', played: 4, won: 0, lost: 4, pointsFor: 18, pointsAgainst: 60, pointDiff: -42, winPct: 0.0 },
];

// cat4 and cat5 — no standings yet
const cat4Standings: TournamentStanding[] = [];
const cat5Standings: TournamentStanding[] = [];

const allStandings: Record<string, TournamentStanding[]> = {
  cat1: cat1Standings,
  cat2: cat2Standings,
  cat3: cat3Standings,
  cat4: cat4Standings,
  cat5: cat5Standings,
};

// =============================================================================
// EXPORTED MOCK FUNCTIONS
// =============================================================================

export async function getMockTournamentPlayers(): Promise<ApiResponse<{ players: TournamentPlayer[] }>> {
  return { data: { players: mockTournamentPlayers }, error: null };
}

export async function getMockCategories(
  _tournamentId: string,
): Promise<ApiResponse<{ categories: TournamentCategory[] }>> {
  return { data: { categories: mockCategories }, error: null };
}

export async function getMockCategoryTeams(
  _tournamentId: string,
  categoryId: string,
): Promise<ApiResponse<{ teams: TournamentTeam[] }>> {
  const teams = allTeams[categoryId] ?? [];
  return { data: { teams }, error: null };
}

export async function getMockCategoryMatches(
  _tournamentId: string,
  categoryId: string,
  round?: number,
): Promise<ApiResponse<{ matches: TournamentMatch[] }>> {
  let matches = allMatches[categoryId] ?? [];
  if (round !== undefined) {
    matches = matches.filter((m) => m.round === round);
  }
  return { data: { matches }, error: null };
}

export async function getMockCategoryStandings(
  _tournamentId: string,
  categoryId: string,
): Promise<ApiResponse<{ standings: TournamentStanding[] }>> {
  const standings = allStandings[categoryId] ?? [];
  return { data: { standings }, error: null };
}
