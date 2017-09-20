import {
  AggGameStats,
  AggPlayerStats,
  PlayerStats,
} from "../schema/types";

// Default values for new models
const baseAggGameStats: AggGameStats = {
  lost: 0,
  played: 0,
  won: 0,
} as AggGameStats;

const baseAggPlayerStats: AggPlayerStats = {
  defense: baseAggGameStats,
  offense: baseAggGameStats,
  total: baseAggGameStats,
} as AggPlayerStats;

export const basePlayerStats: PlayerStats = {
  alltime: baseAggPlayerStats,
};
