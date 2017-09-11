import { ID, PageInfo } from '../../common/relay';

export interface LocationParameters {
  title: string;
  name: string;
  latitude: number;
  longitude: number;
}

export class Location {
  title: string;
  name: string;
  latitude: number;
  longitude: number;
  constructor(params: LocationParameters) {
    this.title = params.title,
    this.name = params.name,
    this.latitude = params.latitude,
    this.longitude = params.longitude
  }
}

export interface TripParameters {
  id: ID;
  description: string;
  startTsUTC: string;
  endTsUTC: string;
  startLocation: Location;
  endLocation: Location;
}

export class Trip {
  id: ID;
  description: string;
  startTsUTC: string;
  endTsUTC: string;
  startLocation: Location;
  endLocation: Location;
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
  node: Trip;
  cursor: ID;
  constructor(node: Trip, cursor: ID) {
    this.node = node;
    this.cursor = cursor;
  }
}

export class TripConnection {
  pageInfo: PageInfo;
  edges: [TripEdge];
  constructor(pageInfo?: PageInfo, edges?: [TripEdge]) {
    this.pageInfo = pageInfo;
    this.edges = edges;
  }
}
