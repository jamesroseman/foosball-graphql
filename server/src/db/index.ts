import { ID, PageInfo } from '../schema/common/relay';
import {
  Location,
  LocationParameters,
  Trip,
  TripConnection,
  TripEdge,
  TripParameters
} from '../schema/models/Trip/Trip';
import {
  Greeting,
  GreetingConnection,
  GreetingEdge,
  IntroduceGreetingInput,
  IntroduceGreetingPayload
} from '../schema/models/Greeting/Greeting';

// Trip Test Data

let mockBosLocation: Location = new Location({
  title: "Boston, Massachusetts, United States",
  name: "Boston",
  latitude: 42.35843,
  longitude: -71.05977
});

let mockNycLocation: Location = new Location({
  title: "New York City, New York, United States",
  name: "New York City",
  latitude: 40.71427,
  longitude: -74.00597
});

let mockBosTrip: Trip = new Trip({
  id: "0",
  description: "Fake BOS test trip in fake DB",
  startTsUTC: "1504828800000",
  endTsUTC: "1505174400000",
  startLocation: mockBosLocation,
  endLocation: mockNycLocation
});

let mockNycTrip: Trip = new Trip({
  id: "1",
  description: "Fake NYC test trip in fake DB",
  startTsUTC: "1504828800000",
  endTsUTC: "1505174400000",
  startLocation: mockNycLocation,
  endLocation: mockBosLocation
});

let mockTripDatabase: Map<string, Trip> = new Map<string, Trip>([
  ["0", mockBosTrip],
  ["1", mockNycTrip]
]);

let mockBosTripEdge: TripEdge = new TripEdge(mockBosTrip, mockBosTrip.id);
let mockNycTripEdge: TripEdge = new TripEdge(mockNycTrip, mockNycTrip.id);

let mockTripConnection = new TripConnection(
  new PageInfo(false, false),
  [mockBosTripEdge, mockNycTripEdge]
);

// Trip

export const getTripById = (id: string) => {
  return mockTripDatabase.get(id);
}

export const getTrips = (args: object) => {
  return mockTripConnection;
}


// GREETING //

/* Greeting fake data (for development) */

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

// Greeting

export const getGreetingById = (id: string) => {
  return fakeDatabase.get(id);
}

export const getGreetingConnection = (args: object) => {
  return fakeConnection;
}
