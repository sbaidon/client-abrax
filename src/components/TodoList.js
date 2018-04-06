import React, { Component } from 'react';
import Todo from './Todo';

export default class TodoList extends Component {
  render() {
    return (
      <div className="todos">
        <h1>{this.props.title}</h1>
        {this.props.todos.length ? (
          this.props.todos.map((todo, index) => (
            <Todo
              deleteTodo={_ => this.props.deleteTodo(todo)}
              updateTodo={_ => this.props.updateTodo(todo)}
              reorderTodo={this.props.reorderTodo}
              key={index}
              todo={todo}
            />
          ))
        ) : (
          <p>No Todos to show</p>
        )}
      </div>
    );
  }
}
