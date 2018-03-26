/* tslint:disable */

/* Helper types */
export type Date = any;
/* Relay common types */
export interface Node {
  id: string;
}
/* Root Query type */
export interface Query {
  node?: Node | null /* Relay signatures */;
  game?: Game | null /* Model signatures */;
  games?: GameConnection | null;
  team?: Team | null;
  teams?: TeamConnection | null;
  user?: User | null;
  users?: UserConnection | null;
}
/* Base Game type */
export interface Game extends Node {
  id: string;
  losingTeamScore: TeamScore;
  winningTeamScore: TeamScore;
  startDate?: string | null;
  endDate: string;
}
/* Helper types */
export interface TeamScore {
  team: Team;
  value: number;
}
/* Base Team type */
export interface Team extends Node {
  id: string;
  offense: User;
  defense: User;
  stats: TeamStats;
}
/* Base User type */
export interface User extends Node {
  id: string;
  firstName: string;
  lastName: string;
  stats: PlayerStats;
}

export interface PlayerStats {
  alltime: PlayerAnalytics;
}

export interface PlayerAnalytics {
  total: PerfAnalytics;
  offense: PerfAnalytics;
  defense: PerfAnalytics;
}
/* Helper types */
export interface PerfAnalytics {
  wins: number;
  winPercentage: number;
  losses: number;
  lossPercentage: number;
  played: number;
  rating?: number | null;
}

export interface TeamStats {
  alltime: PerfAnalytics;
}

export interface GameConnection {
  pageInfo?: PageInfo | null;
  edges?: GameEdge[] | null;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}
/* Game Queries */
export interface GameEdge {
  node: Game;
  cursor: string;
}

export interface TeamConnection {
  pageInfo?: PageInfo | null;
  edges?: TeamEdge[] | null;
}
/* Team Queries */
export interface TeamEdge {
  node: Team;
  cursor: string;
}

export interface UserConnection {
  pageInfo?: PageInfo | null;
  edges?: UserEdge[] | null;
}
/* User Queries */
export interface UserEdge {
  node: User;
  cursor: string;
}
/* Root Mutation type */
export interface Mutation {
  introduceGame?: IntroduceGamePayload | null;
  introduceTeam?: IntroduceTeamPayload | null;
  introduceUser?: IntroduceUserPayload | null;
}

export interface IntroduceGamePayload {
  game: Game;
  clientMutationId: string;
}

export interface IntroduceTeamPayload {
  team: Team;
  clientMutationId: string;
}

export interface IntroduceUserPayload {
  user: User;
  clientMutationId: string;
}

export interface IntroduceGameInput {
  gameInput: GameInput;
  clientMutationId: string;
}
/* Game Mutations */
export interface GameInput {
  losingTeamId: string;
  losingTeamPoints: number;
  winningTeamId: string;
  winningTeamPoints: number;
  startDate?: string | null;
}

export interface IntroduceTeamInput {
  teamInput: TeamInput;
  clientMutationId: string;
}
/* Team Mutations */
export interface TeamInput {
  offenseUserId: string;
  defenseUserId: string;
}

export interface IntroduceUserInput {
  userInput: UserInput;
  clientMutationId: string;
}
/* User Mutations */
export interface UserInput {
  firstName: string;
  lastName: string;
}

export interface ConnectionArgs {
  first?: number | null;
  last?: number | null;
  before?: string | null;
  after?: string | null;
}
export interface NodeQueryArgs {
  id: string;
}
export interface GameQueryArgs {
  id: string;
}
export interface GamesQueryArgs {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
export interface TeamQueryArgs {
  id: string;
}
export interface TeamsQueryArgs {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
export interface UserQueryArgs {
  id: string;
}
export interface UsersQueryArgs {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
export interface IntroduceGameMutationArgs {
  input?: IntroduceGameInput | null;
}
export interface IntroduceTeamMutationArgs {
  input?: IntroduceTeamInput | null;
}
export interface IntroduceUserMutationArgs {
  input?: IntroduceUserInput | null;
}
