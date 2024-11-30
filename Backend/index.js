import express from "express";
import bodyParser from "body-parser";
import db from "./ConfigDB/ConnectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
const app = express();

app.use(express.json());
db.connect();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 8080;
app.use(express.json());

let Current_user_id = "";
app.get("/", (req, res) => {
  res.status(200).send("hello");
});

app.post("/", async (req, res) => {
  const { title,year,poster,runtime,imdbRating,userRating } = req.body;
  console.log(Current_user_id,title,year,poster,runtime,imdbRating,userRating);
  try {
    const response = await db.query(
      "insert into LikedMovies (user_id ,title,year,poster,runtime,imdbrating,userrating)values ($1,$2,$3,$4,$5,$6,$7)",
      [Current_user_id,title,year,poster,runtime,imdbRating,userRating]
    );
    const watched_movies = response.rows[0];
    res.status(201).send(watched_movies);
  } catch (error) {
    console.error("Error inserting user:", error.message);
    res.status(500).send("Error inserting user");
  }
});
const saltRound = 10;



app.get("/profile",async(req, res) => {
  try {
    const data = await db.query("SELECT * FROM user_details as u1 inner join  likedmovies as l1 ON  u1.id = l1.user_id where user_id=($1)",[Current_user_id])
    console.log(data.rows);
    res.status(200).send(data.rows);
    
  } catch (error) {
      console.error("Error getting user:", error.message);
      res.status(500).send("Error getting The Data");
  }
      

})




app.post("/loginSignup", async (req, res) => {
  const { name, password, email, action } = req.body;

  if (action === "register") {
    try {
      console.log(action);
      const CheckUser = await db.query(
        "SELECT * FROM user_details where email = ($1)",
        [email]
      );
      if (CheckUser.rowCount > 0) {
        res.status(404).send("User Already Exist");
      } else {
        bcrypt.hash(password, saltRound, async (err, hash) => {
          if (err) {
            console.log("Error");
          } else {
            const user = await db.query(
              "INSERT INTO user_details ( password, email,name) VALUES($1, $2, $3) RETURNING *",
              [hash, email, name]
            );

            res.status(201).send(user.rows[0]);
            console.log(user);
          }
        });
      }
    } catch (error) {
      console.error("Error inserting user:", error.message);
      res.status(500).send("Error inserting user");
    }
  }
  if (action == "login") {
    const { name, password, email, action } = req.body;
    try {
      console.log(action);
      console.log(email);
      const user = await db.query(
        "SELECT * FROM user_details WHERE email = $1",
        [email]
      );
      console.log(user.rows[0]);
      if (user.rowCount > 0) {
        console.log(`User saved: ${user.rows[0].password}`);
        console.log(`User enter: ${password}`);
        Current_user_id = user.rows[0].id;
        const match = await bcrypt.compare(password, user.rows[0].password);
        console.log(match);
        if (match) {
          return res.status(200).send(user.rows[0]);
        } else {
          return res.status(401).send("Invalid Credentials");
        }
      }
    } catch (error) {
      console.error("Error logging user:", error.message);
      res.status(500).send("Error logging user");
    }
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
