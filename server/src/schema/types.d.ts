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
  greeting: Greeting | null; /* Model signatures */
  greetings: GreetingConnection | null; 
}
/* Base Greeting type */
export interface Greeting extends Node {
  id: string; 
  description: string | null; 
  name: string | null; 
  synonyms: GreetingConnection | null; 
}

export interface GreetingConnection {
  pageInfo: PageInfo | null; 
  edges: GreetingEdge[] | null; 
}

export interface PageInfo {
  hasNextPage: boolean; 
  hasPreviousPage: boolean; 
  startCursor: string | null; 
  endCursor: string | null; 
}
/* Greeting Queries */
export interface GreetingEdge {
  node: Greeting; 
  cursor: string; 
}
/* Root Mutation type */
export interface Mutation {
  introduceGreeting: IntroduceGreetingPayload | null; 
}

export interface IntroduceGreetingPayload {
  greeting: Greeting; 
  clientMutationId: string; 
}
/* Helper types */
export interface Point {
  id: string; 
  date: Date | null; 
}
/* Adjunct types */
export interface Team extends Node {
  id: string; 
  offense: string; 
  defense: string; 
  games: string[]; 
}

export interface GameScore extends Node {
  id: string; 
  game: string; 
  teamScore: TeamScore[]; /* A Game&#x27;s score is comprised of two teams&#x27; scores */
}

export interface TeamScore extends Node {
  id: string; 
  team: string; 
  didWin: boolean; 
  value: number; 
  points: Point[]; 
}
/* Base Game type */
export interface Game extends Node {
  id: string; 
  teams: Team[]; 
  score: GameScore; 
  gameStart: Date; 
  gameEnd: Date | null; 
}

export interface Rating {
  offense: number; 
  defense: number; 
  composite: number; 
  value: number; 
}
/* Base User type */
export interface User extends Node {
  id: string; 
  authMethod: AuthMethod; 
  teams: string[]; 
  games: string[]; 
  rating: Rating; 
}
/* Greeting Mutations */
export interface IntroduceGreetingInput {
  name: string; 
  clientMutationId: string; 
}
export interface NodeQueryArgs {
  id: string; 
}
export interface GreetingQueryArgs {
  id: string; 
}
export interface GreetingsQueryArgs {
  first: number | null; 
  last: number | null; 
  before: string | null; 
  after: string | null; 
}
export interface SynonymsGreetingArgs {
  first: number | null; 
  last: number | null; 
  before: string | null; 
  after: string | null; 
}
export interface IntroduceGreetingMutationArgs {
  input: IntroduceGreetingInput; 
}
/* Helper types */
export type AuthMethod = "TWITTER";

