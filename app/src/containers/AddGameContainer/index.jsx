import React from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import { RelayEnvironment as environment } from '../../relay';

// material-ui
import { CircularProgress } from 'material-ui/Progress';

// components
import AddGame from '../../components/ui-AddGame';

// css
import styles from './styles.css';

export default class AddGameContainer extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query AddGameContainerQuery {
            users {
              edges {
                node {
                  firstName
                  id
                  lastName
                }
              }
            }
          }
        `}
        render={({error, props}) => {
          if (error) {
            // Render error handler here
          } else if (props) {
            const users = props.users.edges.map((userEdge) => userEdge.node);
            return <AddGame users={users} />
          }
          // Render loading handler here
          return <CircularProgress size={80} thickness={5} />;
        }}
      />
    );
  }
}
