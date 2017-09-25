import React from 'react';
import PropTypes from 'prop-types';

// components
import Button from 'material-ui/Button';
import UserSelectorCard from '../ui-UserSelectorCard';
import UserSelectorPen from '../ui-UserSelectorPen';

// css
import styles from './styles.css';

export default class AddGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedUsers: new Map() };
  }

  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired)
  }

  static defaultProps = {
    users: []
  }

  _onClearBtnClick = () => {
    this.setState({ selectedUsers: new Map() });
  }

  _onNextBtnClick = () => {
    const selectedUsers = Array.from(this.state.selectedUsers.values());
    console.log(selectedUsers);
  }

  _onUserDeselect = (user) => {
    const updatedSelection = this.state.selectedUsers;
    updatedSelection.delete(user.id);
    this.setState({ selectedUsers: updatedSelection });
  };

  _onUserSelect = (user) => {
    const updatedSelection = this.state.selectedUsers;
    updatedSelection.set(user.id, user);
    this.setState({ selectedUsers: updatedSelection });
  };

  renderUserSelection(users) {
    return (
      <div className={styles.pen}>
        <UserSelectorPen
          onUserDeselect={this._onUserDeselect}
          onUserSelect={this._onUserSelect}
          selectedUsersMap={this.state.selectedUsers}
        >
          {users.map((user) =>
            <UserSelectorCard key={user.id} user={user} />
          )}
        </UserSelectorPen>
      </div>
    )
  }

  renderSelectedUserBox(usersMap) {
    return (
      <div className={styles.selectedUsers}>
        <UserSelectorPen
          onUserDeselect={this._onUserDeselect}
          onUserSelect={this._onUserSelect}
          selectedUsersMap={this.state.selectedUsers}
        >
          {Array.from(usersMap.values()).map((user) =>
            <UserSelectorCard key={user.id} user={user} />
          )}
        </UserSelectorPen>
      </div>
    )
  }

  renderNextBtn(usersMap) {
    return (
      <div className={styles.nextBtnParent}>
        <Button
          className={styles.clearBtn}
          disabled={ Array.from(usersMap.values()).length <= 0 }
          onClick={this._onClearBtnClick}
          raised
        >
          Clear
        </Button>
        <Button
          className={styles.nextBtn}
          color="primary"
          disabled={ Array.from(usersMap.values()).length < 4 }
          onClick={this._onNextBtnClick}
          raised
        >
          Next
        </Button>
      </div>
    )
  }

  render() {
    const { users } = this.props;
    return (
      <div>
        {this.renderUserSelection(users)}
        {this.renderSelectedUserBox(this.state.selectedUsers)}
        {this.renderNextBtn(this.state.selectedUsers)}
      </div>
    );
  }
}
