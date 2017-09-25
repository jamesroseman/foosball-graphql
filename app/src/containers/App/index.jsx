import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components
import AddGameContainer from "../AddGameContainer";

// css
import styles from './styles.css';

export default class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className={styles.app}>
          <AddGameContainer />
        </div>
      </MuiThemeProvider>
    );
  }
}
