// @flow

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import type { Node } from 'react';

import Index from './components/index/async';
import Demo from './components/demo/async';

const key = (title: string): string => {
  return module.hot ? Math.random().toString() : title;
};

// key={Math.random()} - is a workaround for work of the hmr with react-loadable
// https://medium.com/@giang.nguyen.dev/hot-loader-with-react-loadable-c8f70c8ce1a6
const routes = (): Node => (
  <Switch>
    <Route exact path="/" component={Index} key={key('index')} />
    <Route path="/demo" component={Demo} />
  </Switch>
);

export default routes;
