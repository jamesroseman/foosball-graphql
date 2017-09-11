import { ID, PageInfo } from '../../common/relay';
import {
  IntroduceTripInput,
  IntroduceTripPayload,
  Location,
  Trip,
  TripConnection,
  TripEdge,
  UpdateTripInput,
  UpdateTripPayload
} from './Trip';
import * as Db from '../../../db';

/* Queries */

export const getTripById: (id: string) => Trip =
  (id: string) =>
    Db.getTripById(id);

export const getTrips: (args: object) => TripConnection =
  (args: object) =>
    Db.getTrips(args)

/* Mutations */

export const introduceTrip: (input: IntroduceTripInput) => IntroduceTripPayload =
  (input: IntroduceTripInput) => {
    console.log('introduceTrip', input);
    const newId: ID = (Math.random() * 100).toPrecision(1).toString();
    const newTrip: Trip = new Trip({
      id: newId,
      description: input.description,
      startTsUTC: input.startTsUTC,
      endTsUTC: input.endTsUTC,
      startLocation: input.startLocation,
      endLocation: input.endLocation
    });
    Db.upsertTrip(newTrip);
    return new IntroduceTripPayload(newTrip, input.clientMutationId);
  }

export const updateTrip: (input: UpdateTripInput) => UpdateTripPayload =
  (input: UpdateTripInput) => {
    console.log('updateTrip', input);
    const updatedTrip: Trip = new Trip({
      id: input.id,
      description: input.description,
      startTsUTC: input.startTsUTC,
      endTsUTC: input.endTsUTC,
      startLocation: input.startLocation,
      endLocation: input.endLocation
    });
    Db.upsertTrip(updatedTrip);
    return new UpdateTripPayload(updatedTrip, input.clientMutationId);
  }
