import { ID, PageInfo } from '../../common/relay';

export interface LocationParameters {
  title: string
  name: string
  latitude: number
  longitude: number
}

export class Location {
  title: string
  name: string
  latitude: number
  longitude: number
  constructor(params: LocationParameters) {
    this.title = params.title,
    this.name = params.name,
    this.latitude = params.latitude,
    this.longitude = params.longitude
  }
}

export interface TripParameters {
  id: ID
  description: string
  startTsUTC: string
  endTsUTC: string
  startLocation: Location
  endLocation: Location
}

export class Trip {
  id: ID;
  description: string
  startTsUTC: string
  endTsUTC: string
  startLocation: Location
  endLocation: Location
  constructor(params: TripParameters) {
    this.id = params.id;
    this.description = params.description;
    this.startTsUTC = params.startTsUTC;
    this.endTsUTC = params.endTsUTC;
    this.startLocation = params.startLocation;
    this.endLocation = params.endLocation;
  }
}

// Queries

export class TripEdge {
  node: Trip
  cursor: ID
  constructor(node: Trip, cursor: ID) {
    this.node = node;
    this.cursor = cursor;
  }
}

export class TripConnection {
  pageInfo: PageInfo
  edges: TripEdge[]
  constructor(pageInfo?: PageInfo, edges?: TripEdge[]) {
    this.pageInfo = pageInfo;
    this.edges = edges;
  }
}

// Mutations

export class IntroduceTripInput {
  description: string
  startTsUTC: string
  endTsUTC: string
  startLocation: Location
  endLocation: Location
  clientMutationId: ID
  constructor(
    description: string,
    startTsUTC: string,
    endTsUTC: string,
    startLocation: Location,
    endLocation: Location,
    clientMutationId: ID
  ) {
    this.description = description;
    this.startTsUTC = startTsUTC;
    this.endTsUTC = endTsUTC;
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.clientMutationId = clientMutationId;
  }
}

export class IntroduceTripPayload {
  trip: Trip
  clientMutationId: ID
  constructor(trip: Trip, clientMutationId: ID) {
    this.trip = trip;
    this.clientMutationId = clientMutationId;
  }
}


export class UpdateTripInput {
  id: ID
  description: string
  startTsUTC: string
  endTsUTC: string
  startLocation: Location
  endLocation: Location
  clientMutationId: ID
  constructor(
    id: ID,
    description: string,
    startTsUTC: string,
    endTsUTC: string,
    startLocation: Location,
    endLocation: Location,
    clientMutationId: ID
  ) {
    this.id = id;
    this.description = description;
    this.startTsUTC = startTsUTC;
    this.endTsUTC = endTsUTC;
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.clientMutationId = clientMutationId;
  }
}

export class UpdateTripPayload {
  trip: Trip
  clientMutationId: ID
  constructor(trip: Trip, clientMutationId: ID) {
    this.trip = trip;
    this.clientMutationId = clientMutationId;
  }
}
