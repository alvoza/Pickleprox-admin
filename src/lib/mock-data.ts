import type { User, Court, Tournament, Tip, DashboardStats, Game, ActivityItem } from '@/types/models';

// =============================================================================
// MOCK USERS (25 users)
// =============================================================================

const mockUsers: User[] = [
  { id: 'u1', name: 'Sarah Chen', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@email.com', skillLevel: 'advanced', premiumTier: 'pro', isPremium: true, authProvider: 'google', signInCount: 145, lastSignInAt: '2026-02-08T10:30:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2025-08-15T00:00:00Z', updatedAt: '2026-02-08T10:30:00Z' },
  { id: 'u2', name: 'Marcus Johnson', firstName: 'Marcus', lastName: 'Johnson', email: 'marcus.j@email.com', skillLevel: 'pro', premiumTier: 'pro', isPremium: true, authProvider: 'email', signInCount: 230, lastSignInAt: '2026-02-07T18:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'dark', avatarUrl: null, createdAt: '2025-07-20T00:00:00Z', updatedAt: '2026-02-07T18:00:00Z' },
  { id: 'u3', name: 'Emily Rodriguez', firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.r@email.com', skillLevel: 'intermediate', premiumTier: 'plus', isPremium: true, authProvider: 'google', signInCount: 87, lastSignInAt: '2026-02-08T08:15:00Z', emailVerified: true, notificationsEnabled: true, theme: 'system', avatarUrl: null, createdAt: '2025-09-10T00:00:00Z', updatedAt: '2026-02-08T08:15:00Z' },
  { id: 'u4', name: 'James Kim', firstName: 'James', lastName: 'Kim', email: 'james.kim@email.com', skillLevel: 'advanced', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 56, lastSignInAt: '2026-02-06T14:20:00Z', emailVerified: true, notificationsEnabled: false, theme: 'light', avatarUrl: null, createdAt: '2025-10-05T00:00:00Z', updatedAt: '2026-02-06T14:20:00Z' },
  { id: 'u5', name: 'Ashley Williams', firstName: 'Ashley', lastName: 'Williams', email: 'ashley.w@email.com', skillLevel: 'beginner', premiumTier: 'free', isPremium: false, authProvider: 'google', signInCount: 12, lastSignInAt: '2026-02-05T09:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-02-05T09:00:00Z' },
  { id: 'u6', name: 'David Park', firstName: 'David', lastName: 'Park', email: 'david.park@email.com', skillLevel: 'intermediate', premiumTier: 'plus', isPremium: true, authProvider: 'apple', signInCount: 93, lastSignInAt: '2026-02-08T07:45:00Z', emailVerified: true, notificationsEnabled: true, theme: 'dark', avatarUrl: null, createdAt: '2025-09-01T00:00:00Z', updatedAt: '2026-02-08T07:45:00Z' },
  { id: 'u7', name: 'Maria Gonzalez', firstName: 'Maria', lastName: 'Gonzalez', email: 'maria.g@email.com', skillLevel: 'beginner', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 8, lastSignInAt: '2026-02-03T16:30:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2026-01-28T00:00:00Z', updatedAt: '2026-02-03T16:30:00Z' },
  { id: 'u8', name: 'Chris Taylor', firstName: 'Chris', lastName: 'Taylor', email: 'chris.t@email.com', skillLevel: 'pro', premiumTier: 'plus', isPremium: true, authProvider: 'google', signInCount: 178, lastSignInAt: '2026-02-07T20:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2025-08-01T00:00:00Z', updatedAt: '2026-02-07T20:00:00Z' },
  { id: 'u9', name: 'Lisa Nguyen', firstName: 'Lisa', lastName: 'Nguyen', email: 'lisa.n@email.com', skillLevel: 'intermediate', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 34, lastSignInAt: '2026-02-04T11:00:00Z', emailVerified: true, notificationsEnabled: false, theme: 'system', avatarUrl: null, createdAt: '2025-11-20T00:00:00Z', updatedAt: '2026-02-04T11:00:00Z' },
  { id: 'u10', name: 'Robert Lee', firstName: 'Robert', lastName: 'Lee', email: 'robert.lee@email.com', skillLevel: 'advanced', premiumTier: 'free', isPremium: false, authProvider: 'google', signInCount: 67, lastSignInAt: '2026-02-08T12:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2025-10-15T00:00:00Z', updatedAt: '2026-02-08T12:00:00Z' },
  { id: 'u11', name: 'Jennifer Martinez', firstName: 'Jennifer', lastName: 'Martinez', email: 'jennifer.m@email.com', skillLevel: 'beginner', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 15, lastSignInAt: '2026-02-02T10:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-02-02T10:00:00Z' },
  { id: 'u12', name: 'Michael Brown', firstName: 'Michael', lastName: 'Brown', email: 'michael.b@email.com', skillLevel: 'intermediate', premiumTier: 'free', isPremium: false, authProvider: 'google', signInCount: 42, lastSignInAt: '2026-02-07T15:30:00Z', emailVerified: true, notificationsEnabled: true, theme: 'dark', avatarUrl: null, createdAt: '2025-11-01T00:00:00Z', updatedAt: '2026-02-07T15:30:00Z' },
  { id: 'u13', name: 'Amanda White', firstName: 'Amanda', lastName: 'White', email: 'amanda.w@email.com', skillLevel: 'advanced', premiumTier: 'plus', isPremium: true, authProvider: 'apple', signInCount: 102, lastSignInAt: '2026-02-06T19:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2025-09-20T00:00:00Z', updatedAt: '2026-02-06T19:00:00Z' },
  { id: 'u14', name: 'Daniel Garcia', firstName: 'Daniel', lastName: 'Garcia', email: 'daniel.g@email.com', skillLevel: 'beginner', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 5, lastSignInAt: '2026-01-30T08:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2026-01-25T00:00:00Z', updatedAt: '2026-01-30T08:00:00Z' },
  { id: 'u15', name: 'Rachel Thompson', firstName: 'Rachel', lastName: 'Thompson', email: 'rachel.t@email.com', skillLevel: 'intermediate', premiumTier: 'free', isPremium: false, authProvider: 'google', signInCount: 28, lastSignInAt: '2026-02-05T13:45:00Z', emailVerified: true, notificationsEnabled: true, theme: 'system', avatarUrl: null, createdAt: '2025-12-01T00:00:00Z', updatedAt: '2026-02-05T13:45:00Z' },
  { id: 'u16', name: 'Kevin Anderson', firstName: 'Kevin', lastName: 'Anderson', email: 'kevin.a@email.com', skillLevel: 'pro', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 156, lastSignInAt: '2026-02-08T06:30:00Z', emailVerified: true, notificationsEnabled: true, theme: 'dark', avatarUrl: null, createdAt: '2025-08-10T00:00:00Z', updatedAt: '2026-02-08T06:30:00Z' },
  { id: 'u17', name: 'Sophie Clark', firstName: 'Sophie', lastName: 'Clark', email: 'sophie.c@email.com', skillLevel: 'intermediate', premiumTier: 'free', isPremium: false, authProvider: 'google', signInCount: 51, lastSignInAt: '2026-02-06T10:15:00Z', emailVerified: true, notificationsEnabled: false, theme: 'light', avatarUrl: null, createdAt: '2025-10-25T00:00:00Z', updatedAt: '2026-02-06T10:15:00Z' },
  { id: 'u18', name: 'Brian Wilson', firstName: 'Brian', lastName: 'Wilson', email: 'brian.w@email.com', skillLevel: 'advanced', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 73, lastSignInAt: '2026-02-07T09:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2025-09-15T00:00:00Z', updatedAt: '2026-02-07T09:00:00Z' },
  { id: 'u19', name: 'Nina Patel', firstName: 'Nina', lastName: 'Patel', email: 'nina.p@email.com', skillLevel: 'beginner', premiumTier: 'free', isPremium: false, authProvider: 'google', signInCount: 19, lastSignInAt: '2026-02-04T14:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2026-01-05T00:00:00Z', updatedAt: '2026-02-04T14:00:00Z' },
  { id: 'u20', name: 'Tyler Harris', firstName: 'Tyler', lastName: 'Harris', email: 'tyler.h@email.com', skillLevel: 'intermediate', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 38, lastSignInAt: '2026-02-03T17:30:00Z', emailVerified: true, notificationsEnabled: true, theme: 'dark', avatarUrl: null, createdAt: '2025-11-10T00:00:00Z', updatedAt: '2026-02-03T17:30:00Z' },
  { id: 'u21', name: 'Olivia Scott', firstName: 'Olivia', lastName: 'Scott', email: 'olivia.s@email.com', skillLevel: 'advanced', premiumTier: 'plus', isPremium: true, authProvider: 'google', signInCount: 89, lastSignInAt: '2026-02-08T11:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2025-09-05T00:00:00Z', updatedAt: '2026-02-08T11:00:00Z' },
  { id: 'u22', name: 'Jason Young', firstName: 'Jason', lastName: 'Young', email: 'jason.y@email.com', skillLevel: 'pro', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 198, lastSignInAt: '2026-02-07T21:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2025-07-30T00:00:00Z', updatedAt: '2026-02-07T21:00:00Z' },
  { id: 'u23', name: 'Megan Hall', firstName: 'Megan', lastName: 'Hall', email: 'megan.h@email.com', skillLevel: 'intermediate', premiumTier: 'free', isPremium: false, authProvider: 'apple', signInCount: 24, lastSignInAt: '2026-02-01T12:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'system', avatarUrl: null, createdAt: '2025-12-15T00:00:00Z', updatedAt: '2026-02-01T12:00:00Z' },
  { id: 'u24', name: 'Alex Rivera', firstName: 'Alex', lastName: 'Rivera', email: 'alex.r@email.com', skillLevel: 'advanced', premiumTier: 'free', isPremium: false, authProvider: 'google', signInCount: 61, lastSignInAt: '2026-02-05T16:00:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2025-10-01T00:00:00Z', updatedAt: '2026-02-05T16:00:00Z' },
  { id: 'u25', name: 'Chloe Adams', firstName: 'Chloe', lastName: 'Adams', email: 'chloe.a@email.com', skillLevel: 'beginner', premiumTier: 'free', isPremium: false, authProvider: 'email', signInCount: 3, lastSignInAt: '2026-02-08T09:30:00Z', emailVerified: true, notificationsEnabled: true, theme: 'light', avatarUrl: null, createdAt: '2026-02-05T00:00:00Z', updatedAt: '2026-02-08T09:30:00Z' },
];

// =============================================================================
// MOCK COURTS
// =============================================================================

const mockCourts: Court[] = [
  { id: 'c1', name: 'Sunset Park Courts', location: 'Miami, FL', address: '1234 Sunset Blvd, Miami, FL 33101', rating: 4.5, reviewCount: 128, numberOfCourts: 6, amenities: ['Lights', 'Water Fountain', 'Restrooms', 'Parking'], hoursOpen: '6:00 AM - 10:00 PM', imageUrl: '', coordinates: { latitude: 25.7617, longitude: -80.1918 }, createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-01-15T00:00:00Z' },
  { id: 'c2', name: 'Palm Beach Pickleball Center', location: 'Palm Beach, FL', address: '567 Palm Ave, Palm Beach, FL 33480', rating: 4.8, reviewCount: 256, numberOfCourts: 12, amenities: ['Lights', 'Pro Shop', 'Water Fountain', 'Restrooms', 'Parking', 'Bleachers'], hoursOpen: '7:00 AM - 9:00 PM', imageUrl: '', coordinates: { latitude: 26.7056, longitude: -80.0364 }, createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-01-20T00:00:00Z' },
  { id: 'c3', name: 'Downtown Community Courts', location: 'Fort Lauderdale, FL', address: '890 Main St, Fort Lauderdale, FL 33301', rating: 4.2, reviewCount: 89, numberOfCourts: 4, amenities: ['Lights', 'Water Fountain', 'Restrooms'], hoursOpen: '8:00 AM - 8:00 PM', imageUrl: '', coordinates: { latitude: 26.1224, longitude: -80.1373 }, createdAt: '2025-07-15T00:00:00Z', updatedAt: '2025-12-10T00:00:00Z' },
  { id: 'c4', name: 'Oceanview Recreation Center', location: 'Boca Raton, FL', address: '2345 Ocean Dr, Boca Raton, FL 33432', rating: 4.6, reviewCount: 167, numberOfCourts: 8, amenities: ['Lights', 'Pro Shop', 'Water Fountain', 'Restrooms', 'Parking', 'Cafe'], hoursOpen: '6:30 AM - 9:30 PM', imageUrl: '', coordinates: { latitude: 26.3587, longitude: -80.0831 }, createdAt: '2025-06-15T00:00:00Z', updatedAt: '2026-01-25T00:00:00Z' },
  { id: 'c5', name: 'Coral Springs Sports Complex', location: 'Coral Springs, FL', address: '678 Coral Way, Coral Springs, FL 33071', rating: 4.3, reviewCount: 104, numberOfCourts: 6, amenities: ['Lights', 'Water Fountain', 'Restrooms', 'Parking'], hoursOpen: '7:00 AM - 9:00 PM', imageUrl: '', coordinates: { latitude: 26.2712, longitude: -80.2706 }, createdAt: '2025-08-01T00:00:00Z', updatedAt: '2026-01-10T00:00:00Z' },
  { id: 'c6', name: 'Naples Pickleball Club', location: 'Naples, FL', address: '1122 Gulf Shore Blvd, Naples, FL 34102', rating: 4.9, reviewCount: 312, numberOfCourts: 16, amenities: ['Lights', 'Pro Shop', 'Water Fountain', 'Restrooms', 'Parking', 'Bleachers', 'Cafe', 'Lockers'], hoursOpen: '6:00 AM - 10:00 PM', imageUrl: '', coordinates: { latitude: 26.1420, longitude: -81.7948 }, createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' },
];

// =============================================================================
// MOCK TIPS
// =============================================================================

const mockTips: Tip[] = [
  { id: 't1', content: 'Keep your paddle face open when dinking to maintain control and placement. A slight upward angle helps the ball clear the net with soft pace.', category: 'technique', createdAt: '2025-10-01T00:00:00Z', updatedAt: '2025-10-01T00:00:00Z' },
  { id: 't2', content: 'In doubles, communicate with your partner about who takes the middle shots. The player with the forehand in the middle typically takes it.', category: 'strategy', createdAt: '2025-10-15T00:00:00Z', updatedAt: '2025-10-15T00:00:00Z' },
  { id: 't3', content: 'Warm up your shoulders and wrists before playing. Simple arm circles and wrist rotations can prevent common pickleball injuries.', category: 'fitness', createdAt: '2025-11-01T00:00:00Z', updatedAt: '2025-11-01T00:00:00Z' },
  { id: 't4', content: 'Choose a paddle weight between 7.3-8.4 oz for the best balance of power and control. Lighter paddles offer more control, heavier ones more power.', category: 'equipment', createdAt: '2025-11-15T00:00:00Z', updatedAt: '2025-11-15T00:00:00Z' },
  { id: 't5', content: 'Always call the score loudly before serving. The serving team\'s score comes first, then the receiving team\'s score, then the server number in doubles.', category: 'etiquette', createdAt: '2025-12-01T00:00:00Z', updatedAt: '2025-12-01T00:00:00Z' },
  { id: 't6', content: 'Master the third shot drop to transition from the baseline to the kitchen line. Practice hitting soft, arcing shots that land in the opponent\'s kitchen.', category: 'technique', createdAt: '2025-12-15T00:00:00Z', updatedAt: '2025-12-15T00:00:00Z' },
  { id: 't7', content: 'Target the weaker opponent in doubles play. Identify which player struggles with backhand returns or high-pressure shots and direct more balls their way.', category: 'strategy', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
];

// =============================================================================
// MOCK GAMES
// =============================================================================

const mockGames: Game[] = [
  { id: 'g1', title: 'Saturday Morning Round Robin', description: 'Casual round robin for all levels', location: 'Sunset Park Courts', courtName: 'Sunset Park Courts', date: '2026-02-08', startTime: '9:00 AM', endTime: '11:00 AM', organizerId: 'u1', participantIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'], maxParticipants: 12, participants: [], gameType: 'round_robin', skillLevel: 'all', status: 'open', createdAt: '2026-02-05T00:00:00Z', updatedAt: '2026-02-07T00:00:00Z' },
  { id: 'g2', title: 'Pro Doubles Challenge', description: 'Competitive doubles for advanced players', location: 'Palm Beach Pickleball Center', courtName: 'Palm Beach Pickleball Center', date: '2026-02-09', startTime: '2:00 PM', endTime: '5:00 PM', organizerId: 'u2', participantIds: ['u2', 'u8', 'u16', 'u22'], maxParticipants: 8, participants: [], gameType: 'doubles', skillLevel: 'advanced', status: 'open', createdAt: '2026-02-04T00:00:00Z', updatedAt: '2026-02-06T00:00:00Z' },
  { id: 'g3', title: 'Beginner Friendly Open Play', description: 'Great for newcomers to pickleball', location: 'Downtown Community Courts', courtName: 'Downtown Community Courts', date: '2026-02-07', startTime: '10:00 AM', endTime: '12:00 PM', organizerId: 'u3', participantIds: ['u3', 'u5', 'u7', 'u11', 'u14', 'u19'], maxParticipants: 10, participants: [], gameType: 'open_play', skillLevel: 'beginner', status: 'completed', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-07T12:00:00Z' },
  { id: 'g4', title: 'Wednesday Evening Popcorn', description: 'Random partner assignments each round', location: 'Oceanview Recreation Center', courtName: 'Oceanview Recreation Center', date: '2026-02-05', startTime: '6:00 PM', endTime: '8:00 PM', organizerId: 'u6', participantIds: ['u6', 'u10', 'u12', 'u15', 'u17', 'u18', 'u20', 'u21'], maxParticipants: 12, participants: [], gameType: 'round_robin', skillLevel: 'intermediate', status: 'completed', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-05T20:00:00Z' },
  { id: 'g5', title: 'Claim the Throne Tournament', description: 'Competitive ladder format', location: 'Naples Pickleball Club', courtName: 'Naples Pickleball Club', date: '2026-02-10', startTime: '8:00 AM', endTime: '12:00 PM', organizerId: 'u2', participantIds: ['u2', 'u4', 'u8', 'u10', 'u16', 'u18', 'u22', 'u24'], maxParticipants: 16, participants: [], gameType: 'round_robin', skillLevel: 'advanced', status: 'created', createdAt: '2026-02-06T00:00:00Z', updatedAt: '2026-02-06T00:00:00Z' },
  { id: 'g6', title: 'Mixed Doubles Social', description: 'Social mixed doubles for fun', location: 'Coral Springs Sports Complex', courtName: 'Coral Springs Sports Complex', date: '2026-02-08', startTime: '3:00 PM', endTime: '5:00 PM', organizerId: 'u13', participantIds: ['u13', 'u1', 'u9', 'u12', 'u15', 'u21'], maxParticipants: 8, participants: [], gameType: 'mixed_doubles', skillLevel: 'all', status: 'in_progress', createdAt: '2026-02-03T00:00:00Z', updatedAt: '2026-02-08T15:00:00Z' },
];

// =============================================================================
// MOCK TOURNAMENTS
// =============================================================================

const mockTournaments: Tournament[] = [
  { id: 'tr1', title: 'Miami Pro Series Open', description: 'The premier pickleball tournament in South Florida', type: 'pro_series', imageUrl: '', date: '2026-03-15', endDate: '2026-03-17', startTime: '8:00 AM', location: 'Naples Pickleball Club', venue: 'Naples Pickleball Club', address: '1122 Gulf Shore Blvd, Naples, FL 34102', prizePool: 10000, entryFee: 75, maxParticipants: 64, currentParticipants: 48, registrationOpen: true, format: 'double_elimination', matchType: 'doubles', skillLevelRequired: 'pro', createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-02-05T00:00:00Z' },
  { id: 'tr2', title: 'Community Social Tournament', description: 'Fun social tournament for all skill levels', type: 'social', imageUrl: '', date: '2026-02-22', startTime: '9:00 AM', location: 'Sunset Park Courts', venue: 'Sunset Park Courts', address: '1234 Sunset Blvd, Miami, FL 33101', entryFee: 15, maxParticipants: 32, currentParticipants: 24, registrationOpen: true, format: 'round_robin', matchType: 'doubles', skillLevelRequired: 'all', createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' },
  { id: 'tr3', title: 'Spring League 2026', description: 'Weekly league play over 8 weeks', type: 'league', imageUrl: '', date: '2026-04-01', endDate: '2026-05-24', startTime: '6:00 PM', location: 'Palm Beach Pickleball Center', venue: 'Palm Beach Pickleball Center', address: '567 Palm Ave, Palm Beach, FL 33480', entryFee: 120, maxParticipants: 48, currentParticipants: 12, registrationOpen: true, format: 'round_robin', skillLevelRequired: 'intermediate', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-07T00:00:00Z' },
];

// =============================================================================
// DASHBOARD STATS
// =============================================================================

function generateGrowthData(): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const now = new Date('2026-02-08');
  let cumulative = 10;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    cumulative += Math.floor(Math.random() * 3);
    data.push({ date: d.toISOString().split('T')[0], count: cumulative });
  }
  return data;
}

const recentActivity: ActivityItem[] = [
  { id: 'a1', type: 'user_signup', description: 'Chloe Adams joined PicklePro', timestamp: '2026-02-08T09:30:00Z', userName: 'Chloe Adams' },
  { id: 'a2', type: 'game_created', description: 'Saturday Morning Round Robin created', timestamp: '2026-02-08T08:00:00Z', userName: 'Sarah Chen' },
  { id: 'a3', type: 'session_logged', description: 'Training session logged (2h)', timestamp: '2026-02-07T20:00:00Z', userName: 'Chris Taylor' },
  { id: 'a4', type: 'game_created', description: 'Mixed Doubles Social created', timestamp: '2026-02-07T18:30:00Z', userName: 'Amanda White' },
  { id: 'a5', type: 'user_signup', description: 'New user registered via Google', timestamp: '2026-02-07T15:00:00Z', userName: 'Michael Brown' },
  { id: 'a6', type: 'tournament_created', description: 'Spring League 2026 announced', timestamp: '2026-02-07T10:00:00Z', userName: 'Admin' },
  { id: 'a7', type: 'session_logged', description: 'Recreational session logged (1.5h)', timestamp: '2026-02-06T19:00:00Z', userName: 'Amanda White' },
  { id: 'a8', type: 'game_created', description: 'Claim the Throne Tournament created', timestamp: '2026-02-06T14:00:00Z', userName: 'Marcus Johnson' },
  { id: 'a9', type: 'user_signup', description: 'Daniel Garcia joined PicklePro', timestamp: '2026-02-06T08:00:00Z', userName: 'Daniel Garcia' },
  { id: 'a10', type: 'session_logged', description: 'Practice drills logged (1h)', timestamp: '2026-02-05T17:00:00Z', userName: 'Kevin Anderson' },
];

const mockDashboardStats: DashboardStats = {
  totalUsers: 25,
  activeUsersToday: 8,
  totalEvents: 6,
  sessionsLogged: 142,
  userGrowth: generateGrowthData(),
  recentActivity,
};

// =============================================================================
// MOCK API FUNCTIONS
// =============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getMockDashboard(): Promise<ApiResponse<DashboardStats>> {
  await delay();
  return { data: mockDashboardStats, error: null };
}

export async function getMockUsers(): Promise<ApiResponse<{ users: User[] }>> {
  await delay();
  return { data: { users: mockUsers }, error: null };
}

export async function getMockCourts(): Promise<ApiResponse<{ courts: Court[] }>> {
  await delay();
  return { data: { courts: mockCourts }, error: null };
}

export async function getMockGames(): Promise<ApiResponse<{ games: Game[] }>> {
  await delay();
  return { data: { games: mockGames }, error: null };
}

export async function getMockTournaments(): Promise<ApiResponse<{ tournaments: Tournament[] }>> {
  await delay();
  return { data: { tournaments: mockTournaments }, error: null };
}

export async function getMockTips(): Promise<ApiResponse<{ tips: Tip[] }>> {
  await delay();
  return { data: { tips: mockTips }, error: null };
}
