import {
  Greeting,
  GreetingConnection,
  GreetingEdge,
  IntroduceGreetingInput,
  IntroduceGreetingPayload
} from '../../../typings/types';

const fakeGreeting: Greeting = {
  id: "123",
  name: "Hello, world!",
  description: <string>null,
  synonyms: <GreetingConnection>null
};

const fakeGreetingConnection: GreetingConnection = {
  pageInfo: null,
  edges: []
}

/* Queries */

export const getGreetingById: (id: string) => Greeting =
  (id: string) =>
    fakeGreeting

export const getGreetingConnection: (args: object) => GreetingConnection =
  (args: object) =>
    fakeGreetingConnection

/* Mutations */

export const introduceGreeting: (input: IntroduceGreetingInput) => IntroduceGreetingPayload =
  (input: IntroduceGreetingInput) =>
    ({
      greeting: fakeGreeting,
      clientMutationId: input.clientMutationId
    });
