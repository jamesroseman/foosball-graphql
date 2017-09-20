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
      endDate: new Date().toISOString(),
      losingTeamScore: {
        team: losingTeam,
        value: input.gameInput.losingTeamPoints,
      },
      startDate: input.gameInput.startDate,
      winningTeamScore: {
        team: winningTeam,
        value: input.gameInput.winningTeamPoints,
      },
    } as Game;
    const createdGame: Game = await Db.createGame(game);
    // Update teams with new games (modifies stats)
    await Db.updateTeamWithGame(losingTeam.id, createdGame);
    await Db.updateTeamWithGame(winningTeam.id, createdGame);
    return {
      clientMutationId: input.clientMutationId,
      game: createdGame,
    } as IntroduceGamePayload;
  });
}
