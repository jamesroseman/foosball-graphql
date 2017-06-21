import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { RelayEnvironment as environment } from '../../relay';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// components
import NavBar from '../../components/ui-NavBar';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';

// css
import styles from './styles.css';

export default class App extends React.Component {
  renderHome() {
    return (
      <h2>Tiny GitHunt?!!</h2>
    )
  }

  renderQueryRenderer() {
    return (
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
          return <CircularProgress size={80} thickness={5} />;
        }}
      />
    );
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className={styles.app}>
          <NavBar
            title="HelloWorld"
          />
          <i className="material-icons">face</i>
          {this.renderQueryRenderer()}
        </div>
      </MuiThemeProvider>
    );
  }
}
