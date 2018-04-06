import React from 'react';
import { timefy } from '../utils';

export default function todo(props) {
  return (
    <div className="todo">
      <p>Name: {props.todo.name}</p>
      <p>Description: {props.todo.description}</p>
      {props.todo.timeTaken !== undefined ? (
        <p>Tiempo tomado: {timefy(props.todo.timeTaken)}</p>
      ) : (
        <p>Tiempo total: {timefy(props.todo.time)}</p>
      )}
      <p>Tiempo restante: {timefy(props.todo.remainingTime)}</p>
      <button onClick={props.deleteTodo}>Delete</button>
      <button onClick={props.updateTodo}>Update</button>
    </div>
  );
}
