import * as Db from "../db";
import { Game, GameQueryArgs } from "../schema/types";

/* Root */

export default {
  game: (args: GameQueryArgs) => getGameById(args.id),
};

/* Query */

function getGameById(id: string): Promise<Game> {
  return Db.readGameById(id);
}
