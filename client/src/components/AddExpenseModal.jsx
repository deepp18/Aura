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
    const paymentOptions = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Online Transfer']
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [paidTo, setPaidTo] = useState('')
    const [date, setDate] = useState('')

    const addExpense = async () => {
        if (description === '' || amount === '' || paymentMethod === '' || paidTo === '' || date === '') {
            toast.error('Please fill all the fields!')
            return
        }
        await Api.addExpense({
            email: user.email,
            expense: {
                paid_to: paidTo,
                description: description,
                amount: amount,
                payment_method: paymentMethod,
                date: date
            }
        })
            .then((res) => {
                console.log(res.data)
                setDescription('')
                setAmount('')
                setPaymentMethod('')
                setPaidTo('')
                setDate('')
                setPaymentMethod('')
                handleClose()
                setChange(!change)
                toast.success('Expense Added Successfully!')
            })
            .catch((err) => {
                console.log(err)
                toast.error('Failed to add Expense!')
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
                    {"Add New Expense"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <TextField
                            id="outlined-basic"
                            label="Expense Description"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Amount"
                            variant="outlined"
                            margin="normal"
                            type='number'
                            fullWidth
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Paid To"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            onChange={(e) => setPaidTo(e.target.value)}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Payment Method"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            select
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            {paymentOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
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