import React from 'react';
import { timefy } from '../utils';

export default function Timer(props) {
  return <div className="ba b--blue timer">{timefy(props.time)}</div>;
}
