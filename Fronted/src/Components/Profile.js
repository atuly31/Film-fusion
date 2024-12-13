import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Stack,
  Divider,
  Button
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginModal from "./LoginModal";

const ProfilePage = () => {
  const nav = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [user_Movie, setUser_Movie] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const val = localStorage.getItem("user");
        const User_data = JSON.parse(val);
        if (!User_data) {
          setIsModalOpen(true);
          return;
        }

        setIsModalOpen((pre) => !pre);

        console.log(User_data);
        const userLikedMovie = await axios.get(
          "https://fusionfilm-backend.onrender.com/dashboard",
          {
            withCredentials: true,
            params: {
              currentUser: User_data.id,
            },
          }
        );
        console.log(userLikedMovie.data);
        setUserName(User_data.name);
        setUserEmail(User_data.email);
        if (userLikedMovie) {
          setUser(userLikedMovie.data);
          setUser_Movie(userLikedMovie.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleRedirect = () => {
    nav("/");
    console.log("Redirecting to movie list page");
  };

  return (
    <>
      {isModalOpen ? (
        <LoginModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      ) : (
        <Box
          sx={{
            p: 3,
            maxWidth: 600,
            mx: "auto",
            mt: 5,
            background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", // Gradient background
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={user.profilePhoto}
                alt={user.name}
                sx={{
                  width: 50,
                  height: 50,
                  border: "1px solid #1976d2",
                  boxShadow: 4,
                }}
              >{userName.charAt(0).toUpperCase()}</Avatar>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ color: "#1976d2", fontWeight: "bold" }}
                >
                  {userName}
                </Typography>
                <Typography color="textSecondary">{userEmail}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#1565c0", fontWeight: "bold" }}
            >
              Liked Movies
            </Typography>
            <List>
              {user_Movie.length !== 0 ? (
                user_Movie.map((data, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: "#64b5f6" }}>
                        <MovieIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={data.title}
                      sx={{ color: "#0d47a1" }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="h6" gutterBottom sx={{ color: "#d32f2f" }}>
                  You have not Rated Any Movie
                </Typography>
              )}
            </List>
            <Box sx={{ my: 2, textAlign: "center" }}>
              <Button
                onClick={handleRedirect}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.1s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    boxShadow: 6,
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                    boxShadow: 1,
                  },
                }}
              >
                HOME
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default ProfilePage;
