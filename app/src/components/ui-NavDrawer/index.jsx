import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

export default class NavDrawer extends React.Component {
  static propTypes = {
    open: PropTypes.bool
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Drawer open={this.props.open}>
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
    );
  }
}
