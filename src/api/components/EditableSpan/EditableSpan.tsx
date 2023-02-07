import React, {ChangeEvent, useState} from 'react';
import {log} from "util";

type EditableSpanPropsType = {
    title : string
    onChangeTitle: (newTitle: string) => void
    disabled? : boolean
}

export const EditableSpan = (props: EditableSpanPropsType) => {
    let [editMode, setEditMode] = useState<boolean>(false)

    const activateEditMode = () => {
        setEditMode(true)
    }
   const activateViewMode = () => {
        setEditMode(false)
    }

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        props.onChangeTitle(event.currentTarget.value)

    }

    return (
        editMode
            ? <input autoFocus onBlur={activateViewMode} onChange={onChangeHandler} value={props.title}/>
            : <span onDoubleClick={activateEditMode}>{props.title}</span>
    );
}
