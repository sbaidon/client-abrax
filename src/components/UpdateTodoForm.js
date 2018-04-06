import React from 'react';

export default function UpdateTodoForm(props) {
  return (
    <form className="todo-form" onSubmit={props.handleSubmit}>
      <label htmlFor="description">Descripcion</label>
      <input required={true} name="description" type="text" />
      <label htmlFor="time">Time</label>
      <select required={true} name="time">
        <option default value="1800">
          Corto (30 min)
        </option>
        <option default value="3600">
          Medio (1hr)
        </option>
        <option default value="5400">
          Largo (1hr 30min)
        </option>
      </select>
      <button type="submit" name="send">
        Update todo
      </button>
    </form>
  );
}
