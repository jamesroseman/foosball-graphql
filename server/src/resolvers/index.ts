import GreetingResolvers from "./Greeting";
import TeamResolvers from "./Team";
import UserResolvers from "./User";

// Model Resolvers
const resolvers: [object] = [
  GreetingResolvers,
  TeamResolvers,
  UserResolvers,
];

export default resolvers.reduce((reduced, obj) => {
  return Object.assign({}, reduced, obj);
}, {});
