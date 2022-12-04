import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";

export type FilterValueType = 'all' | 'active' | 'completed'

function App() {

    let [tasks, setTasks] = useState(
        [
            { id: 1, title: "HTML&CSS", isDone: true },
            { id: 2, title: "JS", isDone: true },
            { id: 3, title: "ReactJS", isDone: false },
            { id: 4, title: "REST API", isDone: false },
            { id: 5, title: "GraphQl", isDone: false }
        ]
    )

    const removeTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId))
        console.log(tasks)
    }

    let [filter, setFilter] = useState<FilterValueType>('all')

    let taskForTodolist = tasks;

    if (filter === 'active') {
        taskForTodolist = tasks.filter(task => !task.isDone)
    }
    if (filter === 'completed') {
        taskForTodolist = tasks.filter(task => task.isDone)
    }

    const changeFilter = (value: FilterValueType) => {
        setFilter(value)
    }


    return (
        <div className="App">
           <TodoList title={'What to learn'} task={taskForTodolist} removeTask={removeTask} changeFilter={changeFilter}/>
        </div>
    );
}

export default App;
