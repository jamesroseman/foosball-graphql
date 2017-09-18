import { GreetingModel } from "../models";
import {
  Greeting,
  GreetingConnection,
  GreetingEdge,
  IntroduceGreetingInput,
  IntroduceGreetingPayload,
} from "../schema/types";

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

/* Root */

export default {
  greeting: (args: any) => getGreetingById(args.id),
  greetings: (args: any) => getGreetingConnection(args),
  introduceGreeting: (args: any) => introduceGreeting(args.input),
};

/* Queries */

const getGreetingById: (id: string) => Greeting =
  (id: string) =>
    fakeGreeting;

const getGreetingConnection: (args: object) => GreetingConnection =
  (args: object) =>
    fakeGreetingConnection;

/* Mutations */

const introduceGreeting: (input: IntroduceGreetingInput) => IntroduceGreetingPayload =
  (input: IntroduceGreetingInput) =>
    ({
      clientMutationId: input.clientMutationId,
      greeting: fakeGreeting,
    });
