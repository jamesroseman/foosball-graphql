import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { RelayEnvironment as environment } from '../relay';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h2>Tiny GitHunt?!!</h2>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query AppQuery {
              greeting(id:"3") {
                id,
                name
              }
            }
          `}

          render={({error, props}) => {
            if (error) {
              return <div>{error.message}</div>;
            } else if (props) {
              // return <ul>
              //   {props.greetings.edges.map((edge) =>
              //     <li key={edge.node.id}>{edge.node.name} - {edge.node.id}</li>
              //   )}
              // </ul>
              return <div>{props.greeting.name} - {props.greeting.id}</div>
            }
            return <div>Loading</div>;
          }}
        />
      </div>
    );
  }
}

export default App;
