import { CEILING_RATING, NUM_PLACEMENT_GAMES } from "../../constants";

function getEloFromRating(rating: number): number {
  return Math.pow(10, rating / 400);
}

function getKFactor(rating: number, gamesPlayed: number): number {
  if (gamesPlayed < NUM_PLACEMENT_GAMES) {
    return 40;
  } else if (rating < CEILING_RATING) {
    return 20;
  } else {
    return 10;
  }
}

function getWinExpectFromRatings(rat1: number, rat2: number): number {
  const elo1: number = getEloFromRating(rat1);
  const elo2: number = getEloFromRating(rat2);
  return elo1 / (elo1 + elo2);
}

export function getAdjustedTeamRating(
  teamRating: number,
  oppTeamRating: number,
  gamesPlayed: number,
  didWin: boolean,
): number {
  const winExpect: number = getWinExpectFromRatings(teamRating, oppTeamRating);
  const kFactor: number = getKFactor(teamRating, gamesPlayed);
  const score = didWin ? 1 : 0;
  return teamRating + kFactor * (score - winExpect);
}
