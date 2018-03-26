import {
  PerfAnalytics,
  PlayerAnalytics,
  PlayerStats,
  Team,
  TeamStats,
  User,
} from "../schema/types";

const BASE_RATING: number = 1200;

const basePerfAnalytics: PerfAnalytics = {
  lossPercentage: 0.0,
  losses: 0,
  played: 0,
  rating: BASE_RATING,
  winPercentage: 0.0,
  wins: 0,
} as PerfAnalytics;

const basePlayerStats: PlayerStats = {
  alltime: {
    defense: basePerfAnalytics,
    offense: basePerfAnalytics,
    total: basePerfAnalytics,
  } as PlayerAnalytics,
};

const baseTeamStats: TeamStats = {
  alltime: basePerfAnalytics,
};

export const generateBaseUser = (firstName: string, lastName: string) => ({
  firstName,
  lastName,
  stats: basePlayerStats,
} as User);

export const generateBaseTeam = (defense: User, offense: User) => ({
  defense,
  offense,
  stats: baseTeamStats,
} as Team);
