import React, {useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";

export type FilterValueType = 'all' | 'active' | 'completed'
type TodolistsType = {
    id: string
    title: string
    filter: FilterValueType
}

type TaskStateType = {
    [key: string]:TaskType[]
}


function App() {

    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TaskStateType>({
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},

        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    })


    const removeTask = (taskId: string, todolistId: string) => {
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = todolistTasks.filter(tl => tl.id !== taskId)
        setTasks({...tasks})

    }

    const addTask = (taskTitle: string, todolistId: string) => {
        let newTask = {id: v1(), title: taskTitle, isDone: false}
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = [newTask, ...todolistTasks]
        setTasks({...tasks})
    }


    const changeTaskStatus = (taskId: string, newStatus: boolean, todolistId: string) => {
        let todolistTasks = tasks[todolistId]
        let task = todolistTasks.find(task => task.id === taskId)
        if(task) {
            task.isDone = newStatus
            setTasks({...tasks})
        }
    }

    const changeFilter = (value: FilterValueType, todolistId: string) => {
        let todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists])
        }
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todolistId))
        delete tasks[todolistId]
        setTasks({...tasks})
    }


    // const addTodolist = (title: string) => {
    //     let newTodolistId = v1()
    //     let newTodolist = {id: newTodolistId, title: title, filter: 'all'}
    //     setTodolist([newTodolist, ...todolist])
    // }


    return (
        <div className="App">
            {/*<AddItemForm addItem={addTodolist}/>*/}
            {todolists.map(tl => {
                let allTodolistTasks = tasks[tl.id]
                let taskForTodolist = allTodolistTasks

                if (tl.filter === 'active') {
                    taskForTodolist = allTodolistTasks.filter(task => !task.isDone)
                }
                if (tl.filter === 'completed') {
                    taskForTodolist = allTodolistTasks.filter(task => task.isDone)
                }
                return (
                    <TodoList
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        task={taskForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodolist={removeTodolist}
                        filter={tl.filter}
                    />
                )

            })}

        </div>
    );
}

export default App;
