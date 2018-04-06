import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import subWeeks from 'date-fns/sub_weeks';
import isAfter from 'date-fns/is_after';
import isSameDay from 'date-fns/is_same_day';
import addDays from 'date-fns/add_days';

export default class Graph extends Component {
  getData(todos) {
    const end = Date.now();
    let start = subWeeks(end, 1);
    const dates = [];

    // Get array of days until end date
    while (!isAfter(start, end)) {
      dates.push(start);
      start = addDays(start, 1);
    }

    return dates.map(date => {
      const amount = todos.filter(todo => isSameDay(new Date(todo.createdAt), date)).length;
      return {
        name: `${date.toLocaleDateString()}`,
        amount
      };
    });
  }

  render() {
    const data = this.getData(this.props.todos);
    return (
      <BarChart
        width={1000}
        height={500}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    );
  }
}
