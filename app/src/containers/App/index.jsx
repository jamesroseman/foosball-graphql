import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { RelayEnvironment as environment } from '../../relay';

// css
import styles from './styles.css';

class App extends React.Component {
  render() {
    return (
      <div className={styles.app}>
        <h2 className={styles.app}>Tiny GitHunt?!!</h2>
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
