import * as mongoose from "mongoose";
import { Schema } from "mongoose";

// Overwrite mpromises
(mongoose as any).Promise = global.Promise;

interface IPerfAnalytics {
  wins: number;
  winPercentage: number;
  losses: number;
  lossPercentage: number;
  played: number;
  rating: number;
}

const PerfAnalyticsSchema: Schema = new Schema({
  lossPercentage: {
    default: 0,
    required: true,
    type: Number,
  },
  losses: {
    default: 0,
    required: true,
    type: Number,
  },
  played: {
    default: 0,
    required: true,
    type: Number,
  },
  rating: {
    default: 0,
    required: true,
    type: Number,
  },
  winPercentage: {
    default: 0,
    required: true,
    type: Number,
  },
  wins: {
    default: 0,
    required: true,
    type: Number,
  },
});

interface IPlayerAnalytics {
  total: IPerfAnalytics;
  offense: IPerfAnalytics;
  defense: IPerfAnalytics;
}

const PlayerAnalyticsSchema: Schema = new Schema({
  defense: {
    required: true,
    type: PerfAnalyticsSchema,
  },
  offense: {
    required: true,
    type: PerfAnalyticsSchema,
  },
  total: {
    required: true,
    type: PerfAnalyticsSchema,
  },
});

export interface IPlayerStats {
  alltime: IPlayerAnalytics;
}

export const PlayerStatsSchema: Schema = new Schema({
  alltime: {
    required: true,
    type: PlayerAnalyticsSchema,
  },
});

export interface ITeamStats {
  alltime: IPerfAnalytics;
}

export const TeamStatsSchema: Schema = new Schema({
  alltime: {
    required: true,
    type: PerfAnalyticsSchema,
  },
});
