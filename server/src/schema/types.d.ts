/* tslint:disable */

/* Helper types */
export type Date = any;
/* Relay common types */
export interface Node {
  id: string; 
}
/* Root Query type */
export interface Query {
  node: Node | null; /* Relay signatures */
  game: Game | null; /* Model signatures */
  team: Team | null; 
  user: User | null; 
}
/* Base Game type */
export interface Game extends Node {
  id: string; 
  losingTeamScore: TeamScore; 
  winningTeamScore: TeamScore; 
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
}
/* Base User type */
export interface User extends Node {
  id: string; 
  firstName: string; 
  lastName: string; 
}
/* Root Mutation type */
export interface Mutation {
  introduceTeam: IntroduceTeamPayload | null; 
}

export interface IntroduceTeamPayload {
  team: Team; 
  clientMutationId: string; 
}

export interface PageInfo {
  hasNextPage: boolean; 
  hasPreviousPage: boolean; 
  startCursor: string | null; 
  endCursor: string | null; 
}

export interface ConnectionArgs {
  first: number | null; 
  last: number | null; 
  before: string | null; 
  after: string | null; 
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
export interface NodeQueryArgs {
  id: string; 
}
export interface GameQueryArgs {
  id: string; 
}
export interface TeamQueryArgs {
  id: string; 
}
export interface UserQueryArgs {
  id: string; 
}
export interface IntroduceTeamMutationArgs {
  input: IntroduceTeamInput | null; 
}
