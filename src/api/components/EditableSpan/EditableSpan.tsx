import React, {ChangeEvent, useState} from 'react';

type EditableSpanPropsType = {
    title : string
    onChangeTitle: (newTitle: string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {

    //console.log('Editable called')

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
