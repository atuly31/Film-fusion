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
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const nav = useNavigate();
  const [user, setUser] = useState([]);
  const [user_Movie, setUser_Movie] = useState([]);
  const [userName, setUserName] = useState("");  
  const [userEmail, setUserEmail] = useState(""); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const val = localStorage.getItem("user");
        const User_data = JSON.parse(val)
        const userLikedMovie = await axios.get("http://localhost:4000/dashboard", {
          withCredentials: true,
          params:{
            currentUser:User_data.id
          }
        });
         console.log(userLikedMovie.data)
        setUserName(User_data.name);
        setUserEmail(User_data.email);
        if (userLikedMovie) {
          setUser(userLikedMovie.data);
        }
       
        if (userLikedMovie) {
          setUser_Movie(userLikedMovie.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  },[]);

  const handleRedirect = () => {
   
    nav("/");
    console.log("Redirecting to movie list page");
  };

  return (
   
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user.profilePhoto}
            alt={user.name}
            sx={{ width: 100, height: 100 }}
          />
          <Box>
            <Typography variant="h5">{userName}</Typography>
            <Typography color="textSecondary">{userEmail}</Typography>

          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Liked Movies
        </Typography>
        <List>
          {user_Movie.length!==0 ? user_Movie.map((data, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar>
                  <MovieIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={data.title} />
            </ListItem>
          )): <Typography variant="h6" gutterBottom>
          You have not Rated Any Movie
        </Typography>}
        </List>
      </Paper>
      <Box sx={{ my: 2, textAlign: "center" }}>
        <button onClick={handleRedirect}></button>
      </Box>
    </Box>
  );
};

export default ProfilePage;
