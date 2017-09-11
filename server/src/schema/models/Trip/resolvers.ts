import { ID, PageInfo } from '../../common/relay';
import {
  DeleteTripInput,
  DeleteTripPayload,
  IntroduceTripInput,
  IntroduceTripPayload,
  Location,
  Trip,
  TripConnection,
  TripEdge,
  UndeleteTripInput,
  UndeleteTripPayload,
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

export const deleteTrip: (input: DeleteTripInput) => DeleteTripPayload =
  (input: DeleteTripInput) => {
    let tripToDelete: Trip = Db.getTripById(input.id);
    if (tripToDelete) {
      tripToDelete.isDeleted = true;
      Db.upsertTrip(tripToDelete);
    }
    return new DeleteTripPayload(tripToDelete, input.clientMutationId)
  }

export const undeleteTrip: (input: UndeleteTripInput) => UndeleteTripPayload =
  (input: UndeleteTripInput) => {
    let tripToUndelete: Trip = Db.getTripById(input.id);
    if (tripToUndelete) {
      tripToUndelete.isDeleted = false;
      Db.upsertTrip(tripToUndelete);
    }
    return new UndeleteTripPayload(tripToUndelete, input.clientMutationId);
  }
