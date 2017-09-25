import classNames from 'classnames/bind';
import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import ButtonBase from 'material-ui/ButtonBase';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

// css
import styles from './styles.css';
const cx = classNames.bind(styles);

// static user assets
const staticProPic = 'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png';

export default class UserSelectorCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectable: this.props.selectable };
  }

  static propTypes = {
    onUserDeselect: PropTypes.func,
    onUserSelect: PropTypes.func,
    selectable: PropTypes.bool,
    selected: PropTypes.bool,
    selectedUsers: PropTypes.object,
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired
  }

  static defaultProps = {
    onUserDeselect: () => {},
    onUserSelect: () => {},
    selectable: true,
    selected: false,
  }

  _onUserSelect = () => {
    if (!this.props.selectable && !this.props.selected) {
      return;
    }
    if (this.props.selected) {
      this.props.onUserDeselect(this.props.user);
    } else {
      this.props.onUserSelect(this.props.user);
    }
  };

  render() {
    const { firstName, id, lastName } = this.props.user;
    const contentClassName = cx({
      selected: this.props.selected,
    });
    const cardClassName = cx({
      base: true,
      unselectable: !this.props.selectable && !this.props.selected
    })
    return (
      <ButtonBase
        className={styles.buttonBase}
        disableRipple={!this.props.selectable && !this.props.selected}
        onClick={this._onUserSelect}
      >
        <Card className={cardClassName} raised={this.props.selected}>
          <CardMedia
            className={styles.media}
            image={staticProPic}
            title={`Profile picture of ${firstName} ${lastName}`}
          />
          <CardContent className={contentClassName}>
            <Typography component="body1">
              {firstName}
            </Typography>
          </CardContent>
        </Card>
      </ButtonBase>
    )
  }
}
