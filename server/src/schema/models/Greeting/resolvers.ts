import { ID, PageInfo } from '../../common/relay';
import {
  Greeting,
  GreetingConnection,
  GreetingEdge,
  IntroduceGreetingInput,
  IntroduceGreetingPayload
} from './Greeting';

/* Fake data (for development) */

const fakeConnection: GreetingConnection =
  new GreetingConnection(new PageInfo(false, false), [new GreetingEdge(new Greeting("1", "Hello, world!"), "1")]);

const fakeSynonyms: (first: number, last: number, before: ID, after: ID) => GreetingConnection =
  (first: number, last: number, before: ID, after: ID) =>
    fakeConnection

let fakeDatabase: Map<string, Greeting> = new Map<string, Greeting>([
  ["1", new Greeting("1", "Hello, world!", fakeSynonyms)],
  ["2", new Greeting("2", "Bye now!", fakeSynonyms)],
  ["3", new Greeting("3", "See you later!", fakeSynonyms)]
]);

/* Queries */

export const getGreetingById: (id: string) => Greeting =
  (id: string) =>
    fakeDatabase.get(id);

export const getGreetingConnection: (args: object) => GreetingConnection =
  (args: object) =>
    fakeConnection

/* Mutations */

export const introduceGreeting: (input: IntroduceGreetingInput) => IntroduceGreetingPayload =
  (input: IntroduceGreetingInput) => {
    const newId: ID = (Math.random() * 100).toPrecision(1).toString();
    const newGreeting: Greeting = new Greeting(newId, input.name);
    fakeDatabase.set(newId, newGreeting);
    return new IntroduceGreetingPayload(newGreeting, input.clientMutationId);
  }
