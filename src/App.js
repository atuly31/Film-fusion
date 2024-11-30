import { useEffect, useRef, useState } from "react";
import StarRating from "./Star";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import Searchbar from "./SearchButton";
import Navbar from "./Components/NavigationBar";
import LoginSignup from "./LoginComponent/LoginSignup";
import axios from "axios";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, SetselectedID] = useState("");
  const [movies, iserror, isLodaing] = useMovies(query, Close_btn);
  const [watched, setWatched] = useLocalStorage([], "watched");

  const HandleSelectedID = (selectedID) => {
    SetselectedID(selectedID);
  };
  console.log(watched);
  function Close_btn() {
    SetselectedID("");
  }

  const add_moive_to_List = (Moive) => {
    setWatched((pre) => [...pre, Moive]
    
  );
    
  };
  const sendData = async(movie_list)=>{
    try {
      const response = await axios.post('http://localhost:8080', movie_list);
      console.log("you are in clicked ");
      console.log(watched);
      console.log(response);
        if(response.status===201){
          console.log("Data sent to server");
          alert("Data sent to server successfully!");
        }
        else{
          console.log("Failed to send data to server");
          alert("Failed to send data to server!");
        }

      
    } catch (error) {
      console.error("Error sending data:", error);
      alert("An error occurred while sending data.");
    }
  }

  const handle_delete = (movieID) => {
    setWatched(
      watched.filter((movie) => {
        return movie.imdbID !== movieID;
      })
    );
  };

  return (
    <>
      <Navbar>
        {" "}
        <Searchbar query={query} setQuery={setQuery} />
      </Navbar>
      <Main>
        <ListBox>
          {isLodaing && <Loader />}
          {!isLodaing && !iserror && (
            <MoivesList movies={movies} HandleSelectedID={HandleSelectedID} />
          )}
          {iserror && <Error_message message={iserror} />}
        </ListBox>

        <WatchedBox>
          {selectedID ? (
            <Moive_details
              sendData ={sendData}
              selectedID={selectedID}
              Close_btn={Close_btn}
              add_moive_to_List={add_moive_to_List}
              watched={watched}
            />
          ) : (
            <>
              <Moive_Summary watched={watched} />
              <WatchedMoiveList
                watched={watched}
                handle_delete={handle_delete}
              />
            </>
          )}
        </WatchedBox>
      </Main>
    </>
  );
}

const Loader = () => {
  return (
    <div className="loader">
      <p>Loading</p>
    </div>
  );
};

const Error_message = ({ message }) => {
  return (
    <p className="error">
      {" "}
      <span>{message}</span>
    </p>
  );
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const ListBox = ({ children }) => {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <>
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen1((open) => !open)}
        >
          {isOpen1 ? "–" : "+"}
        </button>
        {isOpen1 && children}
      </div>
    </>
  );
};

const WatchedBox = ({ children }) => {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && <>{children}</>}
    </div>
  );
};

const Moive_details = ({
  selectedID,
  Close_btn,
  add_moive_to_List,
  watched,
  sendData
}) => {
  const [movie, setMovie] = useState({});
  const [userRating, SetuserRating] = useState("");

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: release,
    Actors: actors,
    Genre: genre,
    Director: director,
  } = movie;

  const iswatched = watched
    .map((watchedMovie) => watchedMovie.imdbID)
    .includes(selectedID);

  const handleAdd = () => {
    const watchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating,
      runtime: Number(runtime.split(" ").at(0)),
    };
    add_moive_to_List(watchedMovie);
   
    sendData(watchedMovie);
    
  };
 
  useEffect(() => {
    async function getMoviesByID() {
      const response = await fetch(
        `https://www.omdbapi.com/?i=${selectedID}&apikey=d855abd9`
      );

      const data = await response.json();
      setMovie(data);
    }
    getMoviesByID();
  }, [selectedID]);

  useEffect(
    function () {
      if (!movie.Title) return;
      else document.title = `Movie | ${movie.Title}`;

      return function () {
        document.title = "UsePopCorn";
      };
    },
    [movie.Title]
  );
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.UserRating;

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={Close_btn}>
          &larr;
        </button>
        <img src={poster}></img>
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {release} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>⭐ {imdbRating}</p>
        </div>
      </header>
      <section>
        <div className="rating">
          {!iswatched ? (
            <>
              <StarRating
                maxRating={10}
                size={32}
                onSetRating={SetuserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to List
                </button>
              )}{" "}
            </>
          ) : (
            <p>
              {" "}
              You Already Rated this Moive as {watchedUserRating}{" "}
              <span>⭐</span>{" "}
            </p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p> Starring {actors}</p>
        <p>Directed By {director}</p>
      </section>
    </div>
  );
};

const MoivesList = ({ movies, HandleSelectedID, add_moive_to_List }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movies movie={movie} HandleSelectedID={HandleSelectedID} />
      ))}
    </ul>
  );
};

const Movies = ({ movie, HandleSelectedID }) => {
  return (
    <li onClick={() => HandleSelectedID(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

const Moive_Summary = ({ watched }) => {
  const avgImdbRating = average(
    watched.map((movie) => Number(movie.imdbRating))
  );
  const avgUserRating = average(watched.map((movie) => movie.UserRating));
  const avgRuntime = Math.round(
    average(watched.map((movie) => movie.runtime)),
    1
  );
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

const WatchedMoiveList = ({ watched, handle_delete }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{Number(movie.imdbRating)}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.UserRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              className="btn-delete"
              onClick={() => handle_delete(movie.imdbID)}
            >
              ❌
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
