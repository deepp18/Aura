import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Menu, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import Api from '../api';

const AddExpenseModal = ({ open, handleClose, user, setChange, change }) => {
    
    const [description, setDescription] = useState('')
    
    const [date, setDate] = useState('')

    const addExpense = async () => {
        if (description === ''  || date === '') {
            toast.error('Please fill all the fields!')
            return
        }
        await Api.addExpense({
            email: user.email,
            expense: {
                
                description: description,
              
                date: date
            }
        })
            .then((res) => {
                console.log(res.data)
                setDescription('')
                
                setDate('')
               
                handleClose()
                setChange(!change)
                toast.success('Task Added Successfully!')
            })
            .catch((err) => {
                console.log(err)
                toast.error('Failed to add Task!')
            })
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Add New Task"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <TextField
                            id="outlined-basic"
                            label="Task Description"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        
                      
                            
                        <TextField
                            id="outlined-basic"
                            label="Date"
                            variant="outlined"
                            margin="normal"
                            type='date'
                            fullWidth
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                              }}
                        />  
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={handleClose}>Cancel</Button>
                    <Button onClick={addExpense}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default AddExpenseModal;