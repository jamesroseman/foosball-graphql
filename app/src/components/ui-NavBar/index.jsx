import React from 'react';
import PropTypes from 'prop-types';

// css
import styles from './styles.css';

// components
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import NavDrawer from '../ui-NavDrawer';

// material-ui
import AppBar from 'material-ui/AppBar';

export default class NavBar extends React.Component {
  static propTypes = {
    menuItems: PropTypes.arrayOf(PropTypes.object),
    navBarItems: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })),
    title: PropTypes.string.isRequired
  }

  static defaultPropTypes = {
    menuItems: [],
    navBarItems: []
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  toggleNavDrawer() {
    this.setState({
      open: !this.state.open
    });
  }

  renderNavDrawer() {
    return (
      <Drawer open={this.state.open}>
        <MenuItem>Menu Item</MenuItem>
        <MenuItem>Menu Item 2</MenuItem>
      </Drawer>
    );
  }

  render() {
    return (
      <div>
        <AppBar
          className={styles.navBar}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.toggleNavDrawer}
          onTitleTouchTap={this.toggleNavDrawer}
          title={this.props.title}
        />
        {this.renderNavDrawer()}
      </div>
    );
  }
}
