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
  team: Team | null; 
  user: User | null; 
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
  introduceGreeting: IntroduceGreetingPayload | null; 
}

export interface IntroduceGreetingPayload {
  greeting: Greeting; 
  clientMutationId: string; 
}

export interface ConnectionArgs {
  first: number | null; 
  last: number | null; 
  before: string | null; 
  after: string | null; 
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
export interface TeamQueryArgs {
  id: string; 
}
export interface UserQueryArgs {
  id: string; 
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
