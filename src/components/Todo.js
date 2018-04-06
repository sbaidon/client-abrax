import React from 'react';
import { timefy } from '../utils';

export default function todo(props) {
  return (
    <div className="todo ba b--blue">
      <div className="contols">
        <button onClick={() => props.reorderTodo(props.todo, -1)}>&uarr;</button>
        <button onClick={() => props.reorderTodo(props.todo, 1)}>&darr;</button>
      </div>
      <p>Name: {props.todo.name}</p>
      <p>Description: {props.todo.description}</p>
      {props.todo.timeTaken !== undefined ? (
        <p>Time taken: {timefy(props.todo.timeTaken)}</p>
      ) : (
        <p>Total time: {timefy(props.todo.time)}</p>
      )}
      <p>Remaining time: {timefy(props.todo.remainingTime)}</p>
      <div className="controls">
        <button onClick={props.deleteTodo}>Delete</button>
        <button onClick={props.updateTodo}>Update</button>
      </div>
    </div>
  );
}
