import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Popover,
  IconButton,
} from "@mui/material";

// const settings = ["Profile", "Dashboard", "Logout"];

function Navbar( {children}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [countryAnchorEl, setCountryAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [Genre, setGenre] = useState("");
  const [Country, setCountry] = useState("");
  const nav = useNavigate();
  const genres = [
    "Action", "Animation", "Crime", "Family", "Horror", "Mystery", "Romance",
    "Soap", "TV Movie", "Western", "Adventure", "Biography", "Comedy",
    "Documentary", "Drama", "Fantasy", "History"
  ];
  
  const countries = [
    "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "China",
    "Czech Republic", "Denmark", "Finland", "France", "Germany", "Hong Kong",
    "Hungary", "India", "Ireland", "Israel", "Italy", "Japan", "Luxembourg",
    "Mexico", "Netherlands", "New Zealand", "Norway", "Poland", "Romania", 
    "Russia", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", 
    "Taiwan", "Thailand", "United Kingdom", "United States of America"
  ];

  const handleGenre = (genre) => {
    console.log(`selected ${genre}`);
    setGenre(genre);
  };
  const handleCountry = (country) => {
    console.log(`selected ${country}`);
    setCountry(country);
  };
  
  function HandleRediect () {
    nav("/loginSignup")
  }
  function HandleRedirectdashboard () {
    nav("/profile")
  }
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePopoverOpenCountry = (event) => {
    setCountryAnchorEl(event.currentTarget);
  };

  const handlePopoverCloseCountry = () => {
    setCountryAnchorEl(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    function handleRightClick(e) {
      e.preventDefault();
      handlePopoverClose();
      handlePopoverCloseCountry();
    }

    document.addEventListener("click", handleRightClick);

    return () => {
      document.removeEventListener("click", handleRightClick);
    };
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#111" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#00d2ff",
            marginRight: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#00d2ff", fontWeight: "bold" }}>F</span>MOVIES
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            gap: "20px",
            color: "#fff",
            alignItems: "center",
          }}
        >
          <Button>
            <Typography variant="body1">Home</Typography>
          </Button>
          <Button onMouseEnter={handlePopoverOpen}>
            <Typography variant="body1" sx={{ cursor: "pointer", color: "#00d2ff" }}>
              Genre
            </Typography>
          </Button>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
           
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            sx={{
              pointerEvents: "none",
              "& .MuiPopover-paper": {
                backgroundColor: "#333",
                padding: "15px",
                borderRadius: "10px",
                color: "#fff",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
                gap: "10px",
                pointerEvents: "auto",
              },
            }}
            disableRestoreFocus
          >
            {genres.map((genre) => (
              <Typography
                key={genre}
                variant="body2"
                sx={{ cursor: "pointer", fontSize: "10px" }}
              >
                <ul className="genre-list">
                  <li onClick={() => handleGenre(genre)}>{genre}</li>
                </ul>
              </Typography>
            ))}
          </Popover>
          <Button onMouseEnter={handlePopoverOpenCountry}>
            <Typography variant="body1" sx={{ cursor: "pointer", color: "#00d2ff" }}>
              Country
            </Typography>
          </Button>
          <Popover
            open={Boolean(countryAnchorEl)}
            anchorEl={countryAnchorEl}
            onClose={handlePopoverCloseCountry}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            sx={{
              pointerEvents: "none",
              "& .MuiPopover-paper": {
                backgroundColor: "#333",
                padding: "15px",
                borderRadius: "10px",
                color: "#fff",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
                gap: "10px",
                pointerEvents: "auto",
              },
            }}
            disableRestoreFocus
          >
            {countries.map((country) => (
              <Typography
                key={country}
                variant="body2"
                sx={{ cursor: "pointer", fontSize: "10px" }}
              >
                <ul className="genre-list">
                  <li onClick={() => handleCountry(country)}>{country}</li>
                </ul>
              </Typography>
            ))}
          </Popover>
        </Box>
        
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" } }>
       {children}
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {/* <Avatar alt="Remy Sharp" src={ "/static/images/avatar/2.jpg"} /> */
              <Avatar>A</Avatar>}
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {/* {settings.map((setting) => (
              <MenuItem key={setting} onClick={() => {  HandleRediect()}}>
                <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
              </MenuItem>
            ))} */}
            <MenuItem  onClick={() => {  HandleRediect()}}>
                <Typography sx={{ textAlign: "center" }}>Profile</Typography>
              </MenuItem>
              <MenuItem  onClick={() => {  HandleRedirectdashboard()}}>
                <Typography sx={{ textAlign: "center" }}>Dashboard</Typography>
              </MenuItem>
              <MenuItem  onClick={() => {  HandleRediect()}}>
                <Typography sx={{ textAlign: "center" }}>Logout</Typography>
              </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
