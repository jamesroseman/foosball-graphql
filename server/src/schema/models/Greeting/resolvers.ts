import { ID, PageInfo } from '../../common/relay';
import {
  Greeting,
  GreetingConnection,
  GreetingEdge,
  IntroduceGreetingInput,
  IntroduceGreetingPayload
} from './Greeting';
import * as Db from '../../../db';

/* Queries */

export const getGreetingById: (id: string) => Greeting =
  (id: string) =>
    Db.getGreetingById(id);

export const getGreetingConnection: (args: object) => GreetingConnection =
  (args: object) =>
    Db.getGreetingConnection(args);

/* Mutations */

export const introduceGreeting: (input: IntroduceGreetingInput) => IntroduceGreetingPayload =
  (input: IntroduceGreetingInput) => {
    const newId: ID = (Math.random() * 100).toPrecision(1).toString();
    const newGreeting: Greeting = new Greeting(newId, input.name);
    // fakeDatabase.set(newId, newGreeting);
    return new IntroduceGreetingPayload(newGreeting, input.clientMutationId);
  }
