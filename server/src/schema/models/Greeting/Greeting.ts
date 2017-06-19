import { ID, PageInfo } from '../../common/relay';

export class Greeting {
  id: ID;
  description: string;
  name: string;
  synonyms: (first: number, last: number, before: ID, after: ID) => GreetingConnection;
  constructor(id: ID, name: string, synonyms?: (first: number, last: number, before: ID, after: ID) => GreetingConnection) {
    this.id = id;
    this.description = 'A commonly known greeting.'
    this.name = name;
    this.synonyms = synonyms;
  }
}

// Queries

export class GreetingEdge {
  node: Greeting;
  cursor: ID;
  constructor(node: Greeting, cursor: ID) {
    this.node = node;
    this.cursor = cursor;
  }
}

export class GreetingConnection {
  pageInfo: PageInfo;
  edges: [GreetingEdge];
  constructor(pageInfo?: PageInfo, edges?: [GreetingEdge]) {
    this.pageInfo = pageInfo;
    this.edges = edges;
  }
}

// Mutations

export class IntroduceGreetingInput {
  name: string;
  clientMutationId: ID;
  constructor(name: string, clientMutationId: ID) {
    this.name = name;
    this.clientMutationId = clientMutationId;
  }
}

export class IntroduceGreetingPayload {
  greeting: Greeting;
  clientMutationId: ID;
  constructor(greeting: Greeting, clientMutationId: ID) {
    this.greeting = greeting;
    this.clientMutationId = clientMutationId;
  }
}
