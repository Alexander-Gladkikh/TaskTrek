import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, IconButton, TextField} from "@mui/material";
import {AddBox} from "@mui/icons-material";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}
export const AddItemForm = (props: AddItemFormPropsType) => {
    let [title, setTitle] = useState<string>('')
    let [error, setError] = useState<string | null>(null)


    const addItemHandler = () => {
        if (title.trim() !== '') {
            props.addItem(title.trim())
            setTitle('')
        } else {
            setError('Title is required')
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)

    }
    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (event.key === 'Enter') {
            addItemHandler()
        }
    }
    return (
        <div>
            <TextField
                variant='outlined'
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                error={!!error}
                label='Title'
                helperText={error}
            />
            <IconButton
            color='primary'
            onClick={addItemHandler}>
                <AddBox/>
            </IconButton>
        </div>
    )
}