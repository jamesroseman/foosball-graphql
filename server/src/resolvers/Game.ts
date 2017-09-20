import * as Db from "../db";
import {
  Game,
  GameQueryArgs,
  IntroduceGameInput,
  IntroduceGameMutationArgs,
  IntroduceGamePayload,
  Team,
} from "../schema/types";

/* Root */

export default {
  game: (args: GameQueryArgs) => getGameById(args.id),
  introduceGame: (args: IntroduceGameMutationArgs) => introduceGame(args.input),
};

/* Query */

function getGameById(id: string): Promise<Game> {
  return Db.readGameById(id);
}

/* Mutation */

function introduceGame(input: IntroduceGameInput): Promise<IntroduceGamePayload> {
  return Promise.all([
    Db.readTeamById(input.gameInput.losingTeamId),
    Db.readTeamById(input.gameInput.winningTeamId),
  ]).then(async (teams) => {
    const losingTeam: Team = teams[0];
    const winningTeam: Team = teams[1];
    const game: Game = {
      losingTeamScore: {
        team: losingTeam,
        value: input.gameInput.losingTeamPoints,
      },
      winningTeamScore: {
        team: winningTeam,
        value: input.gameInput.winningTeamPoints,
      },
    } as Game;
    const createdGame: Game = await Db.createGame(game);
    return {
      clientMutationId: input.clientMutationId,
      game: createdGame,
    } as IntroduceGamePayload;
  });
}
