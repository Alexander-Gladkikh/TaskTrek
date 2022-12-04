import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";

export type FilterValueType = 'all' | 'active' | 'completed'

function App() {

    let [tasks, setTasks] = useState(
        [
            { id: v1(), title: "HTML&CSS", isDone: true },
            { id: v1(), title: "JS", isDone: true },
            { id: v1(), title: "ReactJS", isDone: false },
            { id: v1(), title: "REST API", isDone: false },
            { id: v1(), title: "GraphQl", isDone: false }
        ]
    )

    const removeTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId))
    }

    const addTask = (taskTitle: string) => {
        let newTask = {id: v1(), title: taskTitle, isDone: false}
        setTasks([newTask, ...tasks])
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
           <TodoList
               title={'What to learn'}
               task={taskForTodolist}
               removeTask={removeTask}
               changeFilter={changeFilter}
               addTask={addTask}
           />
        </div>
    );
}

export default App;
