import { ID, PageInfo } from '../../common/relay';
import {
  Location,
  Trip,
  TripConnection,
  TripEdge
} from './Trip';
import * as Db from '../../../db';

/* Queries */

export const getTripById: (id: string) => Trip =
  (id: string) =>
    Db.getTripById(id);

export const getTrips: (args: object) => TripConnection =
  (args: object) =>
    Db.getTrips(args)
