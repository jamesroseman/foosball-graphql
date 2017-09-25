import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import Card, { CardContent } from 'material-ui/Card';

// css
import styles from './styles.css';

export default class UserSelectorPen extends React.Component {
  static propTypes = {
    onUserDeselect: PropTypes.func,
    onUserSelect: PropTypes.func,
    selectable: PropTypes.bool,
    selectedUsersMap: PropTypes.object
  }

  static defaultProps = {
    onUserDeselect: () => {},
    onUserSelect: () => {},
    selectable: true,
    selectedUsersMap: new Map(),
  }

  render() {
    const selectCt = Array.from(this.props.selectedUsersMap.values()).length;
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       ...this.props,
       selected: this.props.selectedUsersMap.has(child.props.user.id),
     })
    );
    return (
      <div className={styles.pen}>
        {childrenWithProps}
      </div>
    )
  }
}
