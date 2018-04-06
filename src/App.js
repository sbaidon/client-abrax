import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';

import TodoForm from './components/TodoForm';
import UpdateTodoForm from './components/UpdateTodoForm';
import TodoList from './components/TodoList';
import Timer from './components/Timer';
import Graph from './components/Graph';

import api from './api';
import './App.css';
import 'tachyons/css/tachyons.min.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');

class App extends Component {
  interval = null;
  container = null;
  updatedTodo = null;
  notify = text => toast(text);

  state = {
    todos: [],
    activeTodos: [],
    completedTodos: [],
    activeTodo: {},
    timer: 0,
    customTime: false,
    modalIsOpen: false
  };

  async componentDidMount() {
    // It's preferable in most cases to wait until after mounting to load data.
    // See below for a bit more context...
    await this.loadTodos();
  }

  async componentDidUpdate(prevProps, prevState) {
    // An active todo has expired
    if (this.state.activeTodo && this.state.activeTodo.remainingTime === 0) {
      this.clearInterval();
      await this.markCompleted(prevState.activeTodo);
    }

    // Keep record of active todo
    if (prevState.activeTodo) {
      api.updateTodo(prevState.activeTodo);
    }
  }

  startActive = () => {
    const { activeTodo } = this.state;
    if (!activeTodo) return;
    if (this.interval !== null) return;

    this.interval = setInterval(async () => {
      --activeTodo.remainingTime;
      this.setState({ timer: activeTodo.remainingTime });
    }, 1000);
  };

  pauseActive = () => {
    const { activeTodo } = this.state;
    if (!activeTodo) return;
    this.clearInterval();
  };

  resetTimer() {
    this.setState({ timer: 0 });
  }

  getActive = todos => {
    return todos.filter(todo => todo.status === 'proceso');
  };

  getCompleted = todos => {
    return todos.filter(todo => todo.status === 'terminada');
  };

  clearInterval = () => {
    clearInterval(this.interval);
    this.interval = null;
  };

  componentWillUnmount() {
    this.clearInterval();
  }

  markCompleted = async todo => {
    todo.status = 'terminada';
    todo.timeTaken = todo.time - todo.remainingTime;
    const { data: updatedTodo } = await api.updateTodo(todo);
    const { todos } = this.state;
    const index = todos.findIndex(({ _id }) => _id === updatedTodo._id);
    todos.splice(index, 1, updatedTodo);
    this.updateTodos(todos);
  };

  updateTodos = async todos => {
    const activeTodos = this.getActive(todos);
    const completedTodos = this.getCompleted(todos);
    const activeTodo = activeTodos.length ? activeTodos[0] : null;
    this.setState({
      todos,
      activeTodos,
      completedTodos,
      activeTodo
    });
  };

  loadTodos = async () => {
    const { data: todos } = await api.getTodos();
    this.updateTodos(todos);
  };

  saveTodo = async todo => {
    const { data } = await api.saveTodo({ todo });
    const { todos } = this.state;
    todos.push(data);
    this.updateTodos(todos);
  };

  deleteTodo = async ({ _id: id }) => {
    await api.deleteTodo(id);
    await this.loadTodos();
  };

  updateTodo = async todo => {
    await api.updateTodo(todo);
    await this.loadTodos();
  };

  handleSubmit = async e => {
    e.preventDefault();
    const todo = this.getValues([...e.target.elements]);
    if (!e.target.checkValidity() || this.isTooLong(todo.time)) {
      this.notify('Please fill in all the values');
      return;
    }
    e.target.reset();
    await this.saveTodo(todo);
  };

  isTooLong = time => {
    return time > 7200;
  };

  getValues = elements => {
    return elements
      .filter(element => element.type !== 'submit')
      .map(({ name, value }) => ({ name, value }))
      .reduce((obj, { name, value }) => {
        obj[name] = value;
        return obj;
      }, {});
  };

  handleToggle = e => {
    const { customTime } = this.state;
    this.setState({
      customTime: !customTime
    });
  };

  handleClickPause = e => {
    this.pauseActive();
  };

  handleClickStart = e => {
    this.startActive();
  };

  handleClickCompleted = e => {
    const { activeTodo } = this.state;
    if (!activeTodo) return;
    this.pauseActive();
    this.markCompleted(activeTodo);
    this.resetTimer();
  };

  handleClickUpdate = async todo => {
    this.updatedTodo = todo;
    this.openModal();
  };

  handleSubmitUpdate = async e => {
    e.preventDefault();
    const todo = this.getValues([...e.target.elements]);
    await this.updateTodo({
      _id: this.updatedTodo._id,
      name: this.updatedTodo.name,
      description: todo.description,
      time: todo.time
    });
    this.updatedTodo = null;
    this.closeModal();
  };

  handleClickReorder = (todo, direction) => {
    const { todos } = this.state;
    const currentIndex = todos.findIndex(i => i._id === todo._id);
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex > todos.length) {
      return;
    }
    const movedTodo = todos[newIndex];

    todos[newIndex] = todo;
    todos[currentIndex] = movedTodo;

    this.updateTodos(todos);
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = async () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const { activeTodos, completedTodos, timer, todos } = this.state;
    return (
      <div className="App avenir">
        <header className="App-header">
          <TodoForm customTime={this.state.customTime} handleSubmit={this.handleSubmit} />
          <div className="main-controls">
            <label className="custom-time">
              Custom time
              <input type="checkbox" onChange={this.handleToggle} name="custom-time" />
            </label>
            <button onClick={this.handleClickCompleted}>Mark todo as completed</button>
            <button onClick={this.handleClickStart}>Start current todo</button>
            <button onClick={this.handleClickPause}>Pause current todo</button>
            <Timer time={timer} />
          </div>
        </header>
        <main className="App-main">
          <h1 className="App-title">Todos</h1>
          <div className="todo-container">
            <TodoList
              title="Active Todos"
              todos={activeTodos}
              deleteTodo={this.deleteTodo}
              updateTodo={this.handleClickUpdate}
              reorderTodo={this.handleClickReorder}
            />
            <TodoList
              title="Completed Todos"
              todos={completedTodos}
              deleteTodo={this.deleteTodo}
              updateTodo={this.handleClickUpdate}
              reorderTodo={this.handleClickReorder}
            />
          </div>
          <div className="graph-container">
            <h1>Todos of the week</h1>
            <Graph todos={todos} />
          </div>
          <ToastContainer />
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Update Todo"
          >
            <UpdateTodoForm handleSubmit={this.handleSubmitUpdate} />
          </Modal>
        </main>
      </div>
    );
  }
}

export default App;
