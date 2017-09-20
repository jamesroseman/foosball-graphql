import * as mongoose from "mongoose";
import { Schema } from "mongoose";

interface IAggGameStats {
  won: number;
  lost: number;
  played: number;
}

const AggGameStatsSchema: Schema = new Schema({
  lost: {
    default: 0,
    required: true,
    type: Number,
  },
  played: {
    default: 0,
    required: true,
    type: Number,
  },
  won: {
    default: 0,
    required: true,
    type: Number,
  },
});

interface IAggPlayerStats {
  total: IAggGameStats;
  offense: IAggGameStats;
  defense: IAggGameStats;
}

const AggPlayerStatsSchema: Schema = new Schema({
  defense: {
    required: true,
    type: AggGameStatsSchema,
  },
  offense: {
    required: true,
    type: AggGameStatsSchema,
  },
  total: {
    required: true,
    type: AggGameStatsSchema,
  },
});

export interface IPlayerStats {
  alltime: IAggPlayerStats;
}

export const PlayerStatsSchema: Schema = new Schema({
  alltime: {
    required: true,
    type: AggPlayerStatsSchema,
  },
});
