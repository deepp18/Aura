import React, { useState, useEffect } from "react";
import Center from "../../animated-components/Center";
import Markdown from "https://esm.sh/react-markdown@9";

import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PieChartIcon from "@mui/icons-material/PieChart";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import AddExpenseModal from "../../components/AddExpenseModal";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import Api from "../../api";
import axios from "axios";
import { all } from "axios";

const Tracker = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [change, setChange] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isVisualizeOpen, setIsVisualizeOpen] = useState(false); // For visualizing modal
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [suggestionFromAI, setIsSuggestionFromAI] = useState(null);
  const [sugLoading, setSugLoading] = useState(false);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const handleSuggestion = async () => {
    setSugLoading(true);
    const response = await axios.post("http://localhost:5003/suggestion", {
      expenses: expenses.expenses,
      monthlyIncome: user.monthlyIncome,
    });
    console.log(response)
    setIsSuggestionFromAI(response.data.response)
    setSugLoading(false);
    handleSuggestionOpen()
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleVisualizeOpen = () => {
    setIsVisualizeOpen(true);
  };

  const handleVisualizeClose = () => {
    setIsVisualizeOpen(false);
  };

  const handleSuggestionOpen = () => {
    setIsSuggestionOpen(true);
  };

  const handleSuggestionClose = () => {
    setIsSuggestionOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetchExpenses = async () => {
      await Api.getExpenses({
        email: user.email,
      })
        .then((res) => {
          setAllExpenses(res.data.groupedExpenses);
          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();
          const currentExpenses = res.data.groupedExpenses.filter((expense) => {
            return (
              expense.month_id === currentMonth && expense.year === currentYear
            );
          });
          console.log(currentExpenses);
          if (currentExpenses.length > 0) {
            setExpenses(currentExpenses[0]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchExpenses();
  }, [change]);

  const formatDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  const handleDateChange = (date) => {
    const selectedMonth = date.month() + 1;
    const selectedYear = date.year();
    const selectedExpenses = allExpenses.filter((expense) => {
      return (
        expense.month_id === selectedMonth && expense.year === selectedYear
      );
    });
    if (selectedExpenses.length > 0) {
      setExpenses(selectedExpenses[0]);
    } else {
      setExpenses(null);
    }
    setSelectedDate(date);
  };

  const handleDeleteExpense = async (id) => {
    await Api.deleteExpense({
      email: user.email,
      id: id,
    })
      .then((res) => {
        console.log(res.data);
        setChange(!change);
        toast.success("Expense Deleted Successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete Expense!");
      });
  };

  const getSelectedMonth = (date) => {
    const actualDate = date.month() + 1;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[actualDate - 1];
  };

  const chartData = expenses
    ? expenses.expenses?.map((expense) => ({
        name: expense?.description,
        value: expense?.amount,
        color: generateRandomColor(),
      }))
    : [];

  const barChartData = expenses
    ? expenses.expenses?.map((expense) => ({
        name: expense?.description,
        amount: expense?.amount,
      }))
    : [];

  const paymentMethodPieChartData =
    expenses?.expenses?.length > 0
      ? Object.entries(
          expenses?.expenses?.reduce((acc, { payment_method, amount }) => {
            acc[payment_method] = (acc[payment_method] || 0) + amount;
            return acc;
          }, {})
        ).map(([name, value]) => ({
          name,
          value,
          color: generateRandomColor(),
        }))
      : [];

  return (
    <Center>
      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full flex items-start justify-start gap-8 min-h-[80vh] h-full p-4">
          {open && (
            <AddExpenseModal
              open={open}
              handleClose={handleClose}
              user={user}
              setChange={setChange}
              change={change}
            />
          )}
          <div className="w-[21.5%] flex flex-col items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">Expense Tracker</h1>
              <p className="text-sm">Track your expenses</p>
            </div>
            <Button
              variant="contained"
              color="primary"
              className="flex items-center gap-2"
              fullWidth
              onClick={handleClickOpen}
            >
              <AddCircleRoundedIcon />
              Add Expense
            </Button>
            <Button
              onClick={() => handleSuggestion()}
              variant="contained"
              color="secondary"
              className="flex items-center gap-2"
              fullWidth
            >
              {sugLoading ? <CircularProgress size={24} /> : <><AutoAwesomeIcon /> Suggestion For You</>}
            </Button>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  sx={{ backgroundColor: "white" }}
                  date={selectedDate}
                  onChange={(date) => handleDateChange(date)}
                  onMonthChange={(date) => handleDateChange(date)}
                  onYearChange={(date) => handleDateChange(date)}
                  defaultValue={selectedDate}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="w-[0.5px] !bg-black min-h-[75vh] h-full"></div>
          <div className="w-full flex flex-col items-start justify-start gap-8 p-4 h-[80vh] overflow-y-scroll">
            <div className="w-full flex items-center justify-between">
              <p className="font-medium text-lg">
                Total Expenses of the month {getSelectedMonth(selectedDate)} -{" "}
                <span className="font-bold underline text-xl">
                  ₹{expenses ? expenses.totalAmount : 0}
                </span>
              </p>
              {expenses && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleVisualizeOpen}
                  className="flex items-center gap-2"
                >
                  <PieChartIcon /> Visualize Expenses
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-start justify-start gap-8 w-full">
              {expenses ? (
                expenses.expenses?.map((expense, index) => (
                  <div
                    key={index}
                    className="bg-white relative flex flex-col gap-2 p-4 border border-gray-200 rounded-lg shadow-lg !min-w-[30%] w-auto"
                  >
                    <div
                      className={`absolute top-[-15px] right-0 rounded-full border border-gray-500 p-2 text-xs font-semibold ${
                        expense.payment_method === "Cash"
                          ? "bg-green-500"
                          : expense.payment_method === "Online Transfer"
                          ? "bg-yellow-500"
                          : expense.payment_method === "UPI"
                          ? "bg-purple-500"
                          : expense.payment_method === "Debit Card"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    >
                      <span>{expense.payment_method}</span>
                    </div>
                    <div className="w-full flex items-center justify-between gap-2">
                      <div>
                        <h1 className="text-lg font-bold">
                          {expense.description}
                        </h1>
                        <p className="text-xs font-semibold text-gray-500">
                          Paid to - {expense.paid_to}
                        </p>
                      </div>
                      <IconButton>
                        <InfoOutlinedIcon />
                      </IconButton>
                    </div>
                    <Divider />
                    <div className="w-full flex items-center justify-between gap-2">
                      <div>
                        <h1 className="text-lg font-bold">₹{expense.amount}</h1>
                        <p className="text-xs font-semibold text-gray-500">
                          {formatDate(expense.date)}
                        </p>
                      </div>
                      <IconButton
                        onClick={() => {
                          handleDeleteExpense(expense._id);
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </div>
                  </div>
                ))
              ) : (
                <Center>
                  <h1>No Expenses</h1>
                </Center>
              )}
            </div>
          </div>
          {/* <Modal
                        open={isVisualizeOpen}
                        onClose={handleVisualizeClose}
                        aria-labelledby="visualize-modal-title"
                    >
                        <Box sx={{ width: "100%", p: 4, backgroundColor: 'white', borderRadius: 2, margin: 'auto', mt: '10%' }}>
                            <h2 id="visualize-modal-title">Expense Breakdown</h2>
                            <ResponsiveContainer width="100%" height={300} >
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                                <BarChart width={150} height={40} data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="amount" fill="#8884d8" />
                                </BarChart>
                                <PieChart>
                                    <Pie
                                        data={paymentMethodPieChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {paymentMethodPieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                                <div className='flex items-center justify-between gap-4'>
                                    <div>
                                        <h1 className='text-lg font-bold'>Most Spent Day</h1>
                                        <p className='text-sm font-semibold text-gray-500'>{mostSpentDay?.description}</p>
                                    </div>
                                    <div>
                                        <h1 className='text-lg font-bold'>Amount Spent</h1>
                                        <p className='text-sm font-semibold text-gray-500'>₹{mostSpentDay?.amount}</p>
                                    </div>
                                </div>
                            </ResponsiveContainer>
                        </Box>
                    </Modal> */}
          <Dialog
            open={isVisualizeOpen}
            onClose={handleVisualizeClose}
            maxWidth="lg"
            fullWidth={true}
          >
            <DialogTitle>Expense Breakdown</DialogTitle>
            <DialogContent className="flex items-start justify-start gap-4 w-full flex-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <div className="w-full flex items-center justify-center">
                  <ResponsiveContainer height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {chartData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer height={300}>
                    <BarChart
                      width={150}
                      height={40}
                      data={paymentMethodPieChartData}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* <BarChart width={150} height={40} data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="amount" fill="#8884d8" />
                                </BarChart>
                                <div className='flex items-center justify-center gap-4'>
                                    <div>
                                        <h1 className='text-lg font-bold'>Most Spent Day</h1>
                                        <p className='text-sm font-semibold text-gray-500'>{mostSpentDay?.description}</p>
                                    </div>
                                    <div>
                                        <h1 className='text-lg font-bold'>Amount Spent</h1>
                                        <p className='text-sm font-semibold text-gray-500'>₹{mostSpentDay?.amount}</p>
                                    </div>
                                </div> */}
              </ResponsiveContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleVisualizeClose}>Close</Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={isSuggestionOpen}
            onClose={handleSuggestionClose}
            maxWidth="lg"
            fullWidth={true}
          >
            <DialogTitle>Suggestions from AI to help you in your expenses!</DialogTitle>
            <DialogContent className="flex items-start justify-start gap-4 w-full flex-wrap">
              <ResponsiveContainer width="100%" height={300}>
                  <Markdown>
                    {suggestionFromAI}
                  </Markdown>
              </ResponsiveContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSuggestionClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Center>
  );
};

export default Tracker;
