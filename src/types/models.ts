// =============================================================================
// BASE TYPES
// =============================================================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// USER MODEL
// =============================================================================

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';
export type PlayStyle = 'singles' | 'doubles' | 'mixed';
export type PremiumTier = 'free' | 'plus' | 'pro';
export type AuthProvider = 'email' | 'google' | 'apple' | 'federated';

export interface UserLocation {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface User extends BaseEntity {
  name: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatarUrl?: string | null;
  skillLevel: SkillLevel;
  preferredPlayStyle?: PlayStyle | null;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  isPremium: boolean;
  premiumTier: PremiumTier;
  premiumExpiresAt?: string | null;
  signInCount: number;
  lastSignInAt: string;
  location?: UserLocation | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
}

// =============================================================================
// MATCH MODEL
// =============================================================================

export type MatchStatus = 'scheduled' | 'live' | 'paused' | 'completed' | 'cancelled';
export type MatchType = 'singles' | 'doubles';

export interface MatchScore {
  player: number;
  opponent: number;
}

export interface Match extends BaseEntity {
  title?: string;
  status: MatchStatus;
  matchType: MatchType;
  player1Id: string;
  player2Id?: string;
  opponent1Id: string;
  opponent2Id?: string;
  opponentName: string;
  opponentAvatarUrl?: string;
  currentSet: number;
  totalSets: number;
  score: MatchScore;
  setScores: MatchScore[];
  progress: number;
  courtId?: string;
  courtName?: string;
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
}

// =============================================================================
// TOURNAMENT MODEL
// =============================================================================

export type TournamentType = 'pro_series' | 'social' | 'league' | 'open';
export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';

export interface TournamentOrganizer {
  id: string;
  name: string;
  avatarUrl?: string;
  verified: boolean;
  tournamentsHosted: number;
}

export interface Tournament extends BaseEntity {
  title: string;
  description?: string;
  type: TournamentType;
  imageUrl: string;
  bannerColor?: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  venue?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  prizePool?: number;
  entryFee?: number;
  maxParticipants: number;
  currentParticipants: number;
  registrationOpen: boolean;
  isUserRegistered?: boolean;
  format: TournamentFormat;
  matchType?: MatchType;
  skillLevelRequired?: 'all' | SkillLevel;
  duprRequired?: string;
  organizer?: TournamentOrganizer;
}

// =============================================================================
// GAME MODEL
// =============================================================================

export type GameType = 'singles' | 'doubles' | 'mixed_doubles' | 'round_robin' | 'open_play';
export type GameStatus = 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled' | 'created';
export type RoundRobinFormat = 'popcorn' | 'claim_the_throne';
export type ScoringType = 'rally' | 'side_out';
export type WinCondition = 'win_by_2' | 'first_to_score' | 'win_on_serve';
export type MatchupStatus = 'pending' | 'in_progress' | 'completed';
export type RoundStatus = 'pending' | 'in_progress' | 'completed';
export type ParticipantStatus = 'active' | 'disabled';
export type RSVPStatus = 'confirmed' | 'maybe' | 'declined';
export type RecurrencePattern = 'none' | 'weekly' | 'biweekly';

export interface GameParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  status?: ParticipantStatus;
  rsvpStatus?: RSVPStatus;
}

export interface GameLocation {
  courtName?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Game extends BaseEntity {
  title: string;
  description?: string;
  location: string | GameLocation;
  courtName?: string;
  address?: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  organizerId: string;
  participantIds: string[];
  maxParticipants: number;
  participants: GameParticipant[];
  gameType: GameType;
  skillLevel?: 'all' | SkillLevel;
  status: GameStatus;
  roundRobinConfig?: RoundRobinConfig;
  rounds?: Round[];
  standings?: PlayerStanding[];
  currentRound?: number;
  openPlayConfig?: OpenPlayConfig;
  seriesId?: string;
}

export interface OpenPlayConfig {
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern;
  recurrenceDays: number[];
  recurrenceDescription?: string;
  seriesId?: string;
}

// =============================================================================
// ROUND ROBIN TYPES
// =============================================================================

export type PartnerType = 'random' | 'fixed';

export interface RoundRobinConfig {
  format: RoundRobinFormat;
  pointsPerGame: 11 | 15 | 21;
  scoringType: ScoringType;
  winCondition: WinCondition;
  partnerType: PartnerType;
  courtsCount: number;
  isPrivate: boolean;
}

export interface TeamMember {
  playerId: string;
  playerName: string;
  avatarUrl?: string;
}

export interface MatchupScore {
  team1: number;
  team2: number;
}

export interface Matchup {
  id: string;
  courtNumber: number;
  team1: TeamMember[];
  team2: TeamMember[];
  scores: MatchupScore[];
  winner?: 'team1' | 'team2';
  status: MatchupStatus;
}

export interface Round {
  roundNumber: number;
  matchups: Matchup[];
  sittingOut?: TeamMember[];
  status: RoundStatus;
}

export interface PlayerStanding {
  playerId: string;
  playerName: string;
  avatarUrl?: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  gamesPlayed: number;
  status?: ParticipantStatus;
}

// =============================================================================
// STATS MODEL
// =============================================================================

export interface UserStats {
  userId?: string;
  gamesThisWeek: number;
  hoursPlayedThisWeek: number;
  winsThisWeek: number;
  currentWinStreak: number;
  longestWinStreak: number;
  currentPlayStreak?: number;
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  totalHoursPlayed: number;
  skillRating: number;
  ranking?: number | null;
  achievementCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// TIP MODEL
// =============================================================================

export type TipCategory = 'technique' | 'strategy' | 'fitness' | 'equipment' | 'etiquette';

export interface Tip extends BaseEntity {
  content: string;
  category: TipCategory;
  icon?: string;
  source?: string;
}

// =============================================================================
// SESSION MODEL
// =============================================================================

export type SessionType = 'recreational' | 'training' | 'social' | 'practice';
export type SessionFormat = 'singles' | 'doubles' | 'mixed_doubles';
export type SessionStatus = 'draft' | 'completed' | 'deleted';

export interface Session extends BaseEntity {
  userId: string;
  sessionType: SessionType;
  format?: SessionFormat;
  status: SessionStatus;
  date: string;
  startTime: string;
  duration: number;
  courtId?: string;
  courtName?: string;
  location?: string;
  participants?: { id: string; name: string; avatarUrl?: string }[];
  notes?: string;
  hoursLogged: number;
}

// =============================================================================
// GROUP MODEL
// =============================================================================

export interface Group extends BaseEntity {
  name: string;
  description?: string;
  ownerUserId?: string;
  ownerName?: string;
  memberCount: number;
  isPrivate: boolean;
  location?: string;
  imageUrl?: string;
  bannerUrl?: string;
  tags?: string[];
}

// =============================================================================
// COURT MODEL
// =============================================================================

export interface CourtImage {
  url: string;
  isDefault: boolean;
  order: number;
}

export interface Court extends BaseEntity {
  name: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  numberOfCourts: number;
  amenities: string[];
  hoursOpen: string;
  imageUrl: string;
  images?: CourtImage[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// =============================================================================
// NOTIFICATION MODEL
// =============================================================================

export type NotificationAudience = 'all' | 'skill_level' | 'premium';
export type NotificationStatus = 'sent' | 'failed' | 'sending';

export interface AdminNotification extends BaseEntity {
  title: string;
  body: string;
  audience: NotificationAudience;
  audienceFilter?: string;
  recipientCount: number;
  deliveredCount: number;
  status: NotificationStatus;
  sentBy: string;
}

// =============================================================================
// ADMIN-SPECIFIC TYPES
// =============================================================================

export interface AdminUser {
  userId: string;
  email: string;
  name?: string;
  groups: string[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCourtManager: boolean;
  isGroupAdmin: boolean;
  isTournamentAdmin: boolean;
  managedCourtIds?: string[];
  managedGroupIds?: string[];
}

export interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  totalEvents: number;
  sessionsLogged: number;
  userGrowth: { date: string; count: number }[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'user_signup' | 'game_created' | 'tournament_created' | 'session_logged';
  description: string;
  timestamp: string;
  userName?: string;
}

// =============================================================================
// TOURNAMENT MANAGEMENT TYPES
// =============================================================================

export type CategoryFormat = 'round_robin' | 'single_elimination';
export type CategoryStatus = 'setup' | 'in_progress' | 'completed';
export type TournamentMatchStatus = 'scheduled' | 'in_progress' | 'completed';

/** A category within a tournament (e.g., "Doubles Beginner", "Singles Open") */
export interface TournamentCategory extends BaseEntity {
  tournamentId: string;
  name: string;
  format: CategoryFormat;
  matchType: MatchType;
  skillLevel?: 'all' | SkillLevel;
  duprRange?: string;
  maxTeams: number;
  currentTeams: number;
  status: CategoryStatus;
  qualifyCount?: number;
  order: number;
}

/** CRM player — may or may not be an app user */
export interface TournamentPlayer extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  duprRating?: number;
  skillLevel?: SkillLevel;
  notes?: string;
  userId?: string;
  tournamentsPlayed: number;
}

/** Team registered in a specific category */
export interface TournamentTeam {
  id: string;
  name: string;
  players: { id: string; name: string }[];
  categoryId: string;
  tournamentId: string;
  seed?: number;
}

/** Match within a category */
export interface TournamentMatch {
  id: string;
  tournamentId: string;
  categoryId: string;
  round: number;
  matchNumber: number;
  date?: string;
  time?: string;
  court?: string;
  teamA: { id: string; name: string };
  teamB: { id: string; name: string };
  scoreA?: number;
  scoreB?: number;
  status: TournamentMatchStatus;
  winnerId?: string;
}

/** Computed standing for a team in a category */
export interface TournamentStanding {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
  winPct: number;
  position: number;
}
