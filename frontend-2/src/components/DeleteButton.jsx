import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteButton = ({ handleDelete }) => {
  return (
    <IconButton aria-label="delete" color="warning" onClick={handleDelete}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteButton;
