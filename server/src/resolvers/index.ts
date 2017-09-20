import GameResolvers from "./Game";
import TeamResolvers from "./Team";
import UserResolvers from "./User";

// Model Resolvers
const resolvers: [object] = [
  GameResolvers,
  TeamResolvers,
  UserResolvers,
];

export default resolvers.reduce((reduced, obj) => {
  return Object.assign({}, reduced, obj);
}, {});
