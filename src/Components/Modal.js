import React from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen }) => {
  const nav = useNavigate();

  return (
    <>
      <Dialog
        open={isOpen}
        sx={{
          "& .MuiPaper-root": {
            padding: 2,
            borderRadius: "12px",
            boxShadow: 6,
            backgroundColor: "#f5f5f5",
            minWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          You Are Already Logged In
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: "1rem",
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            Please click on Home to access movies.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            onClick={() => nav("/")}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: "bold",
              px: 3,
              py: 1,
              borderRadius: 3,
              boxShadow: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#115293",
                boxShadow: 4,
              },
              "&:active": {
                transform: "scale(0.95)",
                boxShadow: 1,
              },
            }}
          >
            HOME
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Modal;
