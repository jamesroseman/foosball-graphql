import {
  Greeting,
  GreetingConnection,
  GreetingEdge,
  IntroduceGreetingInput,
  IntroduceGreetingPayload,
} from "../../../typings/types";

const fakeGreeting: Greeting = {
  description: null as string,
  id: "123",
  name: "Hello, world!",
  synonyms: null as GreetingConnection,
};

const fakeGreetingConnection: GreetingConnection = {
  edges: [],
  pageInfo: null,
};

/* Queries */

export const getGreetingById: (id: string) => Greeting =
  (id: string) =>
    fakeGreeting;

export const getGreetingConnection: (args: object) => GreetingConnection =
  (args: object) =>
    fakeGreetingConnection;

/* Mutations */

export const introduceGreeting: (input: IntroduceGreetingInput) => IntroduceGreetingPayload =
  (input: IntroduceGreetingInput) =>
    ({
      clientMutationId: input.clientMutationId,
      greeting: fakeGreeting,
    });
