// src/components/AddTaskModal.jsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import Api from '../api';

const AddTaskModal = ({ open, handleClose, user, setChange, change }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const addTask = async () => {
    try {
      await Api.addTask({
        email: user.email,
        task: {
          title: title?.trim() || 'Untitled task',
          desc: desc?.trim() || '',
          isCompleted: false,
          isAdminGenerated: false,
          date: new Date().toISOString()
        }
      });
      setTitle('');
      setDesc('');
      handleClose();
      setChange(!change);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Add New Tasks"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              label="Task Title"
              variant="outlined"
              margin="normal"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Description"
              variant="outlined"
              margin="normal"
              fullWidth
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleClose}>Cancel</Button>
          <Button onClick={addTask}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddTaskModal;
