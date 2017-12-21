import React, { Component } from 'react';
import DateTime from './DateTime';

export default class App extends Component {
  render() {
    return (
      <DateTime
        dateFormat="DD.MM.YYYY"
      />
    );
  }
}
