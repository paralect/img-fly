// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import type { StateType as ReduxStateType } from 'resources/types';

import { indexPath } from '../paths';

import styles from './header.styles.pcss';

class Header extends Component<PropsType, StateType> {
  state = {
  };

  render(): Node {
    return (
      <div className={styles.header}>
        <Link className={styles.title} to={indexPath()}>
          Img Fly React.JS uploading Demo
        </Link>
      </div>
    );
  }
}

export default connect((state: ReduxStateType): PropsType => ({
}))(Header);
