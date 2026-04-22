'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StandingsTable } from '@/components/tournament/standings-table';
import { MatchRow } from '@/components/tournament/match-row';
import { Trophy, Users, Calendar, BarChart3, Settings, Plus, Zap } from 'lucide-react';
import { capitalize, formatDate } from '@/lib/utils';
import type { Tournament, TournamentCategory, TournamentTeam, TournamentMatch, TournamentStanding } from '@/types/models';

type ManageTab = 'overview' | 'categories' | 'settings';
type CategoryTab = 'teams' | 'fixtures' | 'standings';

export default function TournamentManagePage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [categories, setCategories] = useState<TournamentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation state
  const [mainTab, setMainTab] = useState<ManageTab>('overview');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categoryTab, setCategoryTab] = useState<CategoryTab>('standings');

  // Category data
  const [teams, setTeams] = useState<TournamentTeam[]>([]);
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [standings, setStandings] = useState<TournamentStanding[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // Load tournament and categories
  useEffect(() => {
    async function load() {
      const [tournamentsResult, categoriesResult] = await Promise.all([
        api.admin.getTournaments(),
        api.admin.getCategories(tournamentId),
      ]);

      if (tournamentsResult.data) {
        const found = tournamentsResult.data.tournaments.find(t => t.id === tournamentId);
        if (found) setTournament(found);
      }

      if (categoriesResult.data) {
        setCategories(categoriesResult.data.categories);
        if (categoriesResult.data.categories.length > 0) {
          setSelectedCategoryId(categoriesResult.data.categories[0].id);
        }
      }

      setIsLoading(false);
    }
    load();
  }, [tournamentId]);

  // Load category data when category selection changes
  const loadCategoryData = useCallback(async (categoryId: string) => {
    setLoadingCategory(true);
    const [teamsResult, matchesResult, standingsResult] = await Promise.all([
      api.admin.getCategoryTeams(tournamentId, categoryId),
      api.admin.getCategoryMatches(tournamentId, categoryId),
      api.admin.getCategoryStandings(tournamentId, categoryId),
    ]);

    if (teamsResult.data) setTeams(teamsResult.data.teams);
    if (matchesResult.data) setMatches(matchesResult.data.matches);
    if (standingsResult.data) setStandings(standingsResult.data.standings);
    setLoadingCategory(false);
  }, [tournamentId]);

  useEffect(() => {
    if (selectedCategoryId) {
      loadCategoryData(selectedCategoryId);
    }
  }, [selectedCategoryId, loadCategoryData]);

  function handleSaveScore(matchId: string, scoreA: number, scoreB: number) {
    setMatches(prev => prev.map(m =>
      m.id === matchId
        ? { ...m, scoreA, scoreB, status: 'completed' as const, winnerId: scoreA > scoreB ? m.teamA.id : m.teamB.id }
        : m
    ));
  }

  if (isLoading) return <LoadingSpinner />;
  if (!tournament) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-muted">Tournament not found</p>
      </div>
    );
  }

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  // Group matches by round
  const matchesByRound = matches.reduce<Record<number, TournamentMatch[]>>((acc, m) => {
    if (!acc[m.round]) acc[m.round] = [];
    acc[m.round].push(m);
    return acc;
  }, {});

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <PageHeader
        title={tournament.title}
        subtitle={`${tournament.venue || tournament.location || ''} ${tournament.date ? `· ${formatDate(tournament.date)}` : ''}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Tournaments', href: '/tournaments' },
          { label: 'Manage' },
        ]}
        actions={
          <Button variant="secondary" onClick={() => router.push(`/tournaments/${tournamentId}`)}>
            <Settings size={16} /> Edit Details
          </Button>
        }
      />

      {/* Main tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-50 p-1 dark:bg-dark-tertiary">
        {[
          { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
          { id: 'categories' as const, label: 'Categories', icon: Trophy },
          { id: 'settings' as const, label: 'Settings', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setMainTab(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mainTab === tab.id
                ? 'bg-white text-[var(--foreground)] shadow-sm dark:bg-dark-secondary'
                : 'text-muted hover:text-[var(--foreground)]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {mainTab === 'overview' && (
        <div className="space-y-6">
          {/* Category summary cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setMainTab('categories'); setSelectedCategoryId(cat.id); }}
                className="rounded-xl bg-[var(--card-bg)] p-5 text-left shadow-[var(--card-shadow)] transition-all duration-200 hover:shadow-md dark:border dark:border-border-dark"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{cat.name}</h3>
                    <p className="mt-0.5 text-xs text-muted">
                      {capitalize(cat.format.replace('_', ' '))} · {capitalize(cat.matchType)}
                    </p>
                  </div>
                  <Badge variant={cat.status === 'in_progress' ? 'success' : cat.status === 'completed' ? 'default' : 'warning'}>
                    {capitalize(cat.status.replace('_', ' '))}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Users size={14} />
                    {cat.currentTeams}/{cat.maxTeams} teams
                  </div>
                  {cat.duprRange && (
                    <div className="text-xs text-muted">
                      DUPR {cat.duprRange}
                    </div>
                  )}
                  {cat.qualifyCount && (
                    <div className="text-xs text-brand-orange">
                      Top {cat.qualifyCount} qualify
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Tournament info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-orange/10 p-3 text-brand-orange"><Trophy size={24} /></div>
                <div>
                  <p className="text-sm text-muted">Categories</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{categories.length}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><Users size={24} /></div>
                <div>
                  <p className="text-sm text-muted">Total Teams</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{categories.reduce((sum, c) => sum + c.currentTeams, 0)}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400"><Calendar size={24} /></div>
                <div>
                  <p className="text-sm text-muted">Dates</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {formatDate(tournament.date)}{tournament.endDate ? ` - ${formatDate(tournament.endDate)}` : ''}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Categories Tab — the main working area */}
      {mainTab === 'categories' && (
        <div className="space-y-4">
          {/* Category selector */}
          <div className="flex items-center gap-3 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedCategoryId === cat.id
                    ? 'border-brand-orange bg-brand-orange/8 text-brand-orange'
                    : 'border-gray-200 bg-white text-muted hover:border-gray-300 hover:text-[var(--foreground)] dark:border-border-dark dark:bg-dark-secondary'
                }`}
              >
                {cat.name}
                <span className="ml-2 text-xs opacity-60">{cat.currentTeams} teams</span>
              </button>
            ))}
            <Button variant="ghost" size="sm">
              <Plus size={14} /> Add Category
            </Button>
          </div>

          {selectedCategory && (
            <>
              {/* Category sub-tabs */}
              <div className="flex gap-1 border-b border-gray-100 dark:border-border-dark">
                {[
                  { id: 'standings' as const, label: 'Standings' },
                  { id: 'fixtures' as const, label: 'Fixtures' },
                  { id: 'teams' as const, label: 'Teams' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryTab(tab.id)}
                    className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                      categoryTab === tab.id
                        ? 'border-brand-orange text-brand-orange'
                        : 'border-transparent text-muted hover:text-[var(--foreground)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {loadingCategory ? (
                <LoadingSpinner />
              ) : (
                <>
                  {/* Standings sub-tab */}
                  {categoryTab === 'standings' && (
                    <Card noPadding>
                      <StandingsTable standings={standings} qualifyCount={selectedCategory.qualifyCount} />
                    </Card>
                  )}

                  {/* Fixtures sub-tab */}
                  {categoryTab === 'fixtures' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted">{matches.length} matches across {rounds.length} rounds</p>
                        <Button size="sm">
                          <Zap size={14} /> Generate Next Round
                        </Button>
                      </div>

                      {rounds.map(round => (
                        <FormCard key={round} title={`Round ${round}`} description={`${matchesByRound[round].length} matches`}>
                          <div className="space-y-1">
                            {matchesByRound[round].map(match => (
                              <MatchRow key={match.id} match={match} onSaveScore={handleSaveScore} />
                            ))}
                          </div>
                        </FormCard>
                      ))}
                    </div>
                  )}

                  {/* Teams sub-tab */}
                  {categoryTab === 'teams' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted">{teams.length} of {selectedCategory.maxTeams} teams registered</p>
                        <Button size="sm">
                          <Plus size={14} /> Add Team
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {teams.map((team, idx) => (
                          <div key={team.id} className="flex items-center gap-4 rounded-xl bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] dark:border dark:border-border-dark">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-bold text-brand-orange">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[var(--foreground)]">{team.name}</p>
                              <p className="text-xs text-muted">
                                {team.players.map(p => p.name).join(' & ')}
                              </p>
                            </div>
                            {team.seed && (
                              <Badge variant="default">Seed {team.seed}</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {mainTab === 'settings' && (
        <Card>
          <div className="space-y-4 p-2">
            <p className="text-sm text-muted">Tournament settings and visibility options will be available here.</p>
            <Button variant="secondary" onClick={() => router.push(`/tournaments/${tournamentId}`)}>
              Edit Tournament Details
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
