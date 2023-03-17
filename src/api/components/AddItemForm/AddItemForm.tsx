import React, { ChangeEvent, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import { AddBox } from "@mui/icons-material";

type AddItemFormPropsType = {
  addItem: (title: string) => void;
  disabled?: boolean;
};
export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
  let [title, setTitle] = useState<string>("");
  let [error, setError] = useState<string | null>(null);

  const addItemHandler = () => {
    if (title.trim() !== "") {
      props.addItem(title.trim());
      setTitle("");
    } else {
      setError("Title is required");
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  // const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  //     if (error !== null) {
  //         setError(null)
  //     }
  //     if (event.key === 'Enter') {
  //         addItemHandler()
  //     }
  // }
  return (
    <div>
      <TextField
        variant="outlined"
        value={title}
        onChange={onChangeHandler}
        // onKeyPress={onKeyPressHandler}
        error={!!error}
        label="Title"
        helperText={error}
        disabled={props.disabled}
      />
      <IconButton
        color="primary"
        onClick={addItemHandler}
        disabled={props.disabled}
      >
        <AddBox />
      </IconButton>
    </div>
  );
});
