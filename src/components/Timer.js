import React from 'react';
import { timefy } from '../utils';

export default function Timer(props) {
  return <div className="timer">Time: {timefy(props.time)}</div>;
}
