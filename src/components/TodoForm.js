import React from 'react';

export default function TodoForm(props) {
  const time = !props.customTime ? (
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
  ) : (
    <input required={true} type="number" name="time" />
  );

  return (
    <form className="todo-form" onSubmit={props.handleSubmit}>
      <label htmlFor="name">Nombre</label>
      <input required={true} name="name" type="text" />
      <label htmlFor="description">Descripcion</label>
      <input required={true} name="description" type="text" />
      <label htmlFor="time">Time</label>
      {time}
      <button type="submit" name="send">
        Add todo
      </button>
    </form>
  );
}
