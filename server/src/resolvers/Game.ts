import * as Db from "../db";

// models
import {
  ConnectionArgs,
  Game,
  GameConnection,
  GameQueryArgs,
  IntroduceGameInput,
  IntroduceGameMutationArgs,
  IntroduceGamePayload,
  Team,
} from "../schema/types";

/* Root */

export default {
  game: (args: GameQueryArgs) => getGameById(args.id),
  games: (args: ConnectionArgs) => getGames(args),
  introduceGame: (args: IntroduceGameMutationArgs) => introduceGame(args.input),
};

/* Query */

function getGameById(id: string): Promise<Game> {
  return Db.readGameById(id);
}

function getGames(args: ConnectionArgs): Promise<GameConnection> {
  return Db.readGames(args);
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
