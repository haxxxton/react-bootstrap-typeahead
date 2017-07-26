import cx from 'classnames';
import {noop} from 'lodash';
import React from 'react';

import menuItemContainer from './containers/menuItemContainer';

class BaseMenuItem extends React.Component {
  displayName = 'BaseMenuItem';

  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  render() {
    const {active, children, className, disabled, styles} = this.props;

    return (
      <li
        className={cx({
          'active': active,
          'disabled': disabled,
        }, className)}
        style={styles.resultItem}>
        <a
          onClick={this._handleClick}
          role="button"
          style={styles.resultItemLink}>
          {children}
        </a>
      </li>
    );
  }

  _handleClick(e) {
    const {disabled, onClick} = this.props;

    e.preventDefault();
    !disabled && onClick(e);
  }
}

BaseMenuItem.defaultProps = {
  onClick: noop,
  styles: {},
};

const MenuItem = menuItemContainer(BaseMenuItem);

export {BaseMenuItem};
export default MenuItem;
