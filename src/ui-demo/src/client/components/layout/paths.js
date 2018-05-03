// @flow

import type { LocationShape } from 'react-router-dom';

export const indexPath = (options: LocationShape = {}): LocationShape => ({
  ...options,
  pathname: '/',
});

export const demoPath = (options: LocationShape = {}): LocationShape => ({
  ...options,
  pathname: '/demo',
});

export const profilePath = (options: LocationShape = {}): LocationShape => ({
  ...options,
  pathname: '/profile',
});

export const changePasswordPath = (options: LocationShape = {}): LocationShape => ({
  ...options,
  pathname: '/change-password',
});
