import {useEffect,useState} from "react";
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

const settings = ["Profile", "Dashboard", "Logout"];

function Navbar({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const[Genre ,setGenre] = useState("");
  const isPopoverOpen = Boolean(anchorEl);
  const genres = [
    "Action", "Animation", "Crime", "Family", "Horror", "Mystery", "Romance",
    "Soap", "TV Movie", "Western", "Adventure", "Biography", "Comedy",
    "Documentary", "Drama", "Fantasy", "History"
  ];
  
  const handleGenre = (genre) => {
    console.log(`selected${genre}`)
    setGenre(genre);
   
   
  }
  console.log(Genre)
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  useEffect(() => {
    {
      function handleRightClick(e) {
        e.preventDefault();
       handlePopoverClose();
      }
      document.addEventListener("click", handleRightClick);
      return () => document.removeEventListener("click", handleRightClick);
    }
  });

  return (
    <AppBar position="static" sx={{ backgroundColor: "#111" }}>
      <Toolbar>
        {/* Logo */}
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

        {/* Menu Items */}
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
          <Button
            onMouseEnter={handlePopoverOpen}
            // onMouseLeave={handlePopoverClose}
          >
            <Typography
              variant="body1"
              sx={{ cursor: "pointer", color: "#00d2ff" }}
            >
              Genre
            </Typography>
          </Button>
          <Button>
            <Typography variant="body1">Country</Typography>
          </Button>
          <Button>
            <Typography>Movies</Typography>
          </Button>
          <Button>
            <Typography variant="body1">TV Shows</Typography>
          </Button>
          <Typography variant="body1">Top IMDB</Typography>
          <Typography variant="body1">Android App</Typography>
        </Box>

        {/* Dropdown list for Genre */}
        <Popover
          open={isPopoverOpen}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          // onClick={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            pointerEvents: "none", // Allows it to close when the cursor leaves
            "& .MuiPopover-paper": {
              backgroundColor: "#333",
              padding: "15px",
              borderRadius: "10px",
              color: "#fff",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
              gap: "10px",
              pointerEvents: "auto", // Ensures popover stays open while hovered
            },
          }}
          disableRestoreFocus
        >
         {genres.map((genre) => (
          <Typography variant="body2" sx={{ cursor: "pointer", fontSize:"10px" }}> <ul className="genre-list" ><li  key={genre} onClick={()=>handleGenre(genre)} value = {genre} >
             {genre}
            </li>
            </ul>
            </Typography>
           
          ))}
        </Popover>

        <Box
          sx={{
            backgroundColor: "#333",
            borderRadius: "20px",
            padding: "5px 10px",
            display: "flex",
            alignItems: "center",
            color: "#fff",
            marginRight: "20px",
          }}
        >
          {children}
        </Box>

        {/* User Icon */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
