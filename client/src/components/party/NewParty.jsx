import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { CircularProgress } from "@mui/material";
import Api from "../../api";
import { toast } from "react-toastify";

const NewParty = ({ usersList, user, change, setChange }) => {

  const [partyName, setPartyName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [btnName, setBtnName] = useState("Create a Party");
  const [partyCode, setPartyCode] = useState("");

  const handleUserChange = (event, newValue) => {
    setSelectedUsers(newValue);
    const emails = newValue.map((u) => u.email);
    setEmailList(emails);
  };

  const handleCreateParty = async () => {
    setBtnName(<CircularProgress size={24} color="inherit" />);

    if (partyName === "") {
      toast.error("Please enter a party name");
      setBtnName("Create a Party");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      setBtnName("Create a Party");
      return;
    }

    await Api.sendInvite({
      senderName: user.name,
      receiverEmails: emailList,
      partyName: partyName,
      email: user.email,
    })
      .then(() => {
        toast.success("Party invite sent successfully!");
        setChange(!change);
        window.location.reload();
      })
      .catch(() => {
        toast.error("Error sending party invite");
      });

    setBtnName("Create a Party");
  };

  const handleJoinParty = () => {
    if (!partyCode) {
      toast.error("Please enter a party code");
      return;
    }

    console.log("Joining party:", partyCode);

    // call your join party API here
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 text-white">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center">
        Create a Party now!!
      </h1>

      <p className="text-gray-300 text-center mt-2">
        Join your friends in a quest of challenges to defeat a final boss!!
      </p>

      {/* CREATE PARTY */}
      <div className="w-full max-w-xl flex flex-col gap-6 mt-10">

        <TextField
          label="Party Name"
          variant="outlined"
          fullWidth
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "white" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "& fieldset": { borderColor: "#666" },
              "&:hover fieldset": { borderColor: "#8b5cf6" },
              "&.Mui-focused fieldset": { borderColor: "#6366f1" },
            },
          }}
        />

        <Autocomplete
          multiple
          options={usersList}
          value={selectedUsers}
          onChange={handleUserChange}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.name}
                {...getTagProps({ index })}
                sx={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "white",
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Party Members"
              placeholder="Choose friends..."
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{
                ...params.InputProps,
                style: { color: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "#666" },
                  "&:hover fieldset": { borderColor: "#8b5cf6" },
                  "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                },
              }}
            />
          )}
        />

        <button
          onClick={handleCreateParty}
          className="w-full py-3 text-lg font-semibold rounded-xl
          bg-gradient-to-r from-blue-500 to-purple-500
          hover:from-blue-600 hover:to-purple-600
          transition-all duration-300 shadow-lg"
        >
          {btnName}
        </button>

      </div>

      

    </div>
  );
};

export default NewParty;