import { Document, Model } from "mongoose";

// models
import { IUserModel } from "../models";
import { PageInfo, UserConnection, UserEdge } from "../schema/types";

interface IEdge<T> {
  node: T;
  cursor: string;
}

interface IConnection<T> {
  edges: Array<IEdge<T>>;
  pageInfo: PageInfo;
}

interface IPagination {
  docs: Document[];
  offset: number;
  limit: number;
  total: number;
}

export function readDocsAfterCursor<T>(
  model: Model<Document>,
  modelToType: any,
  sort: object,
  first: number,
  index: number,
) {
  const offset = index > -1 ? index + 1 : 0;
  const options = typeof first === "undefined" ? { offset, sort } : { offset, sort, limit: first };
  return model
    .paginate({}, options)
    .then(paginationToConnectionFactory<T>(modelToType));
}

export function readDocsBeforeCursor<T>(
  model: Model<Document>,
  modelToType: any,
  sort: object,
  last: number,
  index: number,
) {
  // TODO: you're doing this wrong
  const offset = (index > -1) && last && index > last ? index - last : 0;
  const options = typeof last === "undefined" ? { offset, sort } : { offset, sort, limit: last };
  return model
    .paginate({}, options)
    .then(paginationToConnectionFactory<T>(modelToType));
}

export function modelsToEdges<T>(docs: Document[], modelToType: any): Promise<Array<IEdge<T>>> {
  return Promise.all(docs
    .map(async (model) => {
      const type = await modelToType(model);
      return {
        cursor: type.id,
        node: type,
      } as IEdge<T>;
    }));
}

export function paginationToConnectionFactory<T>(modelToType: any): any {
  return async function paginationToConnection(pagination: IPagination): Promise<IConnection<T>> {
    const docs: Document[] = pagination.docs;
    const edges: Array<IEdge<T>> = await modelsToEdges<T>(pagination.docs, modelToType);
    const pageInfo: PageInfo = {
      endCursor: docs.length > 0 ? docs[docs.length - 1]._id : null,
      hasNextPage: (pagination.offset + pagination.limit) < pagination.total,
      hasPreviousPage: (pagination.offset - pagination.limit) >= 0,
      startCursor: docs.length > 0 ? docs[0]._id : null,
    } as PageInfo;
    return {
      edges,
      pageInfo,
    } as IConnection<T>;
  };
}
