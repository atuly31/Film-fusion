import express from "express";
import bodyParser from "body-parser";
import db from "./ConfigDB/ConnectDB.js";
import session from "express-session";
import cors from "cors";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 8080;

app.use(express.json());
db.connect();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,               // Allow cookies to be sent
  })
);


// Session configuration
app.use(
  session({
    secret:  "fallbackSecret",
    resave: false,
    saveUninitialized: false, // Do not save empty sessions
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions
console.log("Session secret:", process.env.SESSION_SECRET || "fallbackSecret");
// app.use((req, res, next) => {
//   console.log("Session:", req.session);
//   console.log("User:", req.user);
//   next();
// });

let Current_user_id = null;

// Passport Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, 
    async (email, password, done) => {
    
      try {
        const user = await db.query(
          "SELECT * FROM user_details WHERE email = $1",
          [email]
        );
        // console.log(user.rows[0].id)
        if (user.rowCount === 0) {
          return done(null, false, { message: "No user found" });
        }

        const storedPassword = user.rows[0].password;
        Current_user_id = user.rows[0].id;
        // console.log(Current_user_id)
        const isMatch = await bcrypt.compare(password, storedPassword);
        if (isMatch) {
          return done(null, user.rows[0]); // Store entire row (except password).
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize User: Store User ID in Session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize User: Fetch User Details from ID in Session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.query("SELECT * FROM user_details WHERE id = $1", [
      id,
    ]);
    done(null, user.rows[0]); 
  } catch (err) {
    done(err);
  }
});

// Routes
app.post("/loginSignup", async (req, res) => {
  const { name, password, email, action } = req.body;

  if (action === "register") {
    try {
      const CheckUser = await db.query(
        "SELECT * FROM user_details WHERE email = $1",
        [email]
      );
       
      if (CheckUser.rowCount > 0) {
        return res.status(409).send("User Already Exists");
      }
      
      const hash = await bcrypt.hash(password, 10);
      const newUser = await db.query(
        "INSERT INTO user_details (password, email, name) VALUES ($1, $2, $3) RETURNING *",
        [hash, email, name]
      );
      Current_user_id = newUser.rows[0].id;
      res.status(201).send(newUser.rows[0]);
    } catch (error) {
      console.error("Registration Error:", error.message);
      res.status(500).send("Error registering user");
    }
  }

  if (action === "login") {
    // (`login email: ${email}`)console.log
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).send("Error during login");
      }
      if (!user) {
        return res.status(401).send(info.message || "Invalid credentials");
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).send("Error logging in");
        }
        return res.status(200).send(user);
      });
    })(req, res);
  }
});

app.post("/", async (req, res) => {
  const { title, year, poster, runtime, imdbRating, userRating,imdbID } = req.body;
  
  console.log(
    Current_user_id,
    title,
    year,
    poster,
    runtime,
    imdbRating,
    userRating,
    imdbID
  );
  try {
     await db.query(
      "insert into LikedMovies (user_id ,title,year,poster,runtime,imdbrating,userrating,imdbID)values ($1,$2,$3,$4,$5,$6,$7,$8)",
      [Current_user_id, title, year, poster, runtime, imdbRating, userRating,imdbID]
    );
    const response = await db.query(
      "SELECT * FROM user_details u1 INNER JOIN likedmovies l1 ON u1.id = l1.user_id WHERE user_id = $1",
      [Current_user_id] 
    );
    const watched_movies = response.rows[0];
    console.log(watched_movies)
    res.status(201).send(watched_movies);
  } catch (error) {
    console.error("Error inserting user:", error.message);
    res.status(500).send("Error inserting user");
  }
});


app.get("/dashboard", async (req, res) => {
  
 
  try {
    const data = await db.query(
      "SELECT * FROM user_details u1 INNER JOIN likedmovies l1 ON u1.id = l1.user_id WHERE user_id = $1",
      [Current_user_id] 
    );
    res.status(200).send(data.rows);
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).send("Error fetching profile data");
  }
});

app.get("/", async (req, res) => {
  
 
  try {
    const data = await db.query(
      "SELECT * FROM user_details u1 INNER JOIN likedmovies l1 ON u1.id = l1.user_id WHERE user_id = $1",
      [Current_user_id] 
    );
    res.status(200).send(data.rows);
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).send("Error fetching profile data");
  }
});


app.delete("/", async (req, res) => {
  const { movieID } = req.body;
  console.log(movieID)
  try {
    const response = await db.query("DELETE FROM likedmovies WHERE imdbid =($1)",[movieID])
    console.log(response)
    res.status(200).send("Deleted Successfully");
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).send("Error fetching profile data");
  }
 

});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));