import * as path from 'path';
import { readSchema } from '../../../util/graphql';

// Model Resolvers
import {
  deleteTrip,
  getTripById,
  getTrips,
  introduceTrip,
  undeleteTrip,
  updateTrip
} from './resolvers';

// Model Schema String
const localSchemaPath = path.join(__dirname, 'Trip.graphql');
export const TripSchemaStr: string = readSchema(localSchemaPath);

// Schema Root
export const TripResolvers: object = {
  trip: (args: any) => getTripById(args.id),
  trips: (args: any) => getTrips(args),
  introduceTrip: (args: any) => introduceTrip(args.input),
  updateTrip: (args: any) => updateTrip(args.input),
  deleteTrip: (args: any) => deleteTrip(args.input),
  undeleteTrip: (args: any) => undeleteTrip(args.input)
}
