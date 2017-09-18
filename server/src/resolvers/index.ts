import GreetingResolvers from "./Greeting";

// Model Resolvers
const resolvers: [object] = [
  GreetingResolvers,
];

export default resolvers.reduce((reduced, obj) => {
  return Object.assign({}, reduced, obj);
}, {});
