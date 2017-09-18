import GreetingResolvers from "./Greeting";
import UserResolvers from "./User";

// Model Resolvers
const resolvers: [object] = [
  GreetingResolvers,
  UserResolvers,
];

export default resolvers.reduce((reduced, obj) => {
  return Object.assign({}, reduced, obj);
}, {});
