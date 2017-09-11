import * as Db from '../../../db';

export const getNodeById: (id: string) => any =
  (id: string) =>
    Db.getNodeById(id);
