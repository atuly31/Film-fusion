import { useEffect, useRef, useState } from "react";
import StarRating from "./Star";
import { useMovies } from "./useMovies";
import Searchbar from "./SearchButton";
import Navbar from "./Components/NavigationBar";
import WatchedMoiveList from "./WatchedMoiveList";
import axios from "axios";
import MovieCarousel from "./Components/HomePage";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, SetselectedID] = useState("");
  const [movie_ID, setmovieID] = useState("");
  const [movies, iserror, isLodaing,] = useMovies(query, Close_btn);
  const [watched, setWatched] = useState([]);
  const [Genre, setGenre] = useState("")
  const [genremovies, setGenremovies] = useState([])
  const handleGenre = (genre) => {
    console.log(`selected ${genre}`);
    setGenre(genre);
  };


  const HandleSelectedID = (selectedID) => {
    SetselectedID(selectedID);
  };
  const handleMovieID = (id) => {
    setmovieID(id);
  }

  console.log(watched);

  function Close_btn() {
    SetselectedID("");
  }
 console.log("button on click",movie_ID)


  useEffect(() => {
    const fetchUserData = async () => {
      const val = localStorage.getItem("user");
      const User_data = JSON.parse(val);
      try {
        const response = await axios.get("https://fusionfilm-backend.onrender.com", {
         
          params: {
            currentUser: User_data.id
          }
        });
        console.log(response.data);
        setWatched(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const sendData = async (movie_list) => {
    try {
      const val = localStorage.getItem("user");
      const User_data = JSON.parse(val); 
      const response = await axios.post("https://fusionfilm-backend.onrender.com", {
        ...movie_list,
        currentUser: User_data.id,
      });

      if (response.status === 201) {
        console.log("Data sent to server");
        alert("Data sent to server successfully!");
      } else {
        console.log("Failed to send data to server");
        alert("Failed to send data to server!");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      alert("An error occurred while sending data.");
    }
  };


  const deleteMovie = async (movieID) => {
    try {
      console.log(movieID);
      const response = await axios.delete("https://fusionfilm-backend.onrender.com", {
        data: { movieID },
      });

      if (response.status === 200) {
        console.log("Movie deleted successfully");
        alert("Movie deleted successfully!");
      } else {
        console.log("Failed to delete movie");
        alert("Failed to delete movie!");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("An error occurred while deleting movie.");
    }
  };

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://streaming-availability.p.rapidapi.com/shows/search/filters",
      params: {
        country: "us",
        series_granularity: "show",
        genres: `${Genre}`,
        order_direction: "asc",
        order_by: "original_title",
        genres_relation: "and",
        output_language: "en",
        show_type: "movie",
      },
      headers: {
        "x-rapidapi-key": `${process.env.REACT_APP_API}`,
        "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
      },
    };

    async function fetchGenre() {

      try {
        const response = await axios.request(options);
        console.log(response.data.shows);
        setGenremovies(response.data.shows);
      } catch (error) {
        console.error(error);
      }
    }
    fetchGenre();

  }, [Genre]);

  const handle_delete = (movieID) => {
    console.log(movieID);
    deleteMovie(movieID);
  };

  return (

    <>

      <Navbar handleGenre={handleGenre}>
        <Searchbar query={query} setQuery={setQuery} />
      </Navbar>

      <Main>
        <ListBox>

          {query === "" && <MovieCarousel handleMovieID={handleMovieID} />}
          {/* {isLodaing && <Loader />} */}
          {query !== "" && (
            <MoivesList movies={movies} genremovies={genremovies} HandleSelectedID={HandleSelectedID} Genre={Genre} />
          )}
          {Genre !== "" && <MoivesList movies={movies} genremovies={genremovies} Genre={Genre} HandleSelectedID={HandleSelectedID} />}
          {/* {iserror && <Error_message message={iserror} />} */}
        </ListBox>

        <WatchedBox>
          {selectedID ? (
            <Moive_details
              sendData={sendData}
              movie_ID={movie_ID}
              selectedID={selectedID}
              Close_btn={Close_btn}
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
  watched,
  sendData,
  movie_ID
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

  useEffect(() => {
    if (!movie_ID) return;

    const fetchMovieDetails = async () => {
      // setLoading(true); // Start loading
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie_ID}`, {
          params: { language: "en-US" },
          headers: {
            accept: "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDM5YTkzYTc0NjA4ZTEyZjZjY2UwOTMzODYzMzRiYiIsIm5iZiI6MTcyNTAxNjM1MS41MTQsInN1YiI6IjY2ZDFhOTFmMDkwOTY5OTQ2MWI1ZjBmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eGbu-E_6_xTsqX2onqZ_M5mfwJwYcqUuJXt_ewE5PEE`, // Use environment variable
          },
        });
        console.log(response.data)
        setMovie(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching movie details:", error.response?.data || error.message);
      } 
      // finally {
      //   setLoading(false); // End loading
      // }
    };

    fetchMovieDetails();

    // Optional cleanup
    return () => {
      setMovie(null); // Reset movie state if `movie_ID` changes
    };
  }, [movie_ID]);

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

const MoivesList = ({ movies, HandleSelectedID, genremovies, Genre }) => {
  console.log(movies);
  console.log(Genre);
  return (
    <ul className="list list-movies">
      {Genre === ""
        ? movies.map((movie) => (
          <Movies
            key={movie.imdbID} // Add a key for better list rendering
            movie={movie}
            HandleSelectedID={HandleSelectedID}
            Genre={Genre}
          />
        ))
        : genremovies.map((movie) => (
          <Movies
            key={movie.imdbID} // Ensure unique keys are added
            movie={movie}
            HandleSelectedID={HandleSelectedID}
            Genre={Genre}
          />
        ))}
    </ul>
  );
};

const Movies = ({ movie, HandleSelectedID, Genre }) => {

  return (
    <li onClick={() => HandleSelectedID(movie.imdbID)} key={movie.imdbID}>
      {Genre === "" ? (
        <>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>

          </div>


        </>
      ) : (
        <>
          <img
            src={movie.imageSet.verticalPoster?.w720}
            alt={`${movie.title} poster`}
          />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.releaseYear}</span>
            </p>
          </div>

        </>
      )}
    </li>
  );
};


const Moive_Summary = ({ watched }) => {
  const avgImdbRating = Math.round(average(
    watched.map((movie) => Number(movie.imdbrating))
  ), 2);
  const avgUserRating = Math.round(average(watched.map((movie) => movie.userrating)), 2);
  const avgRuntime = Math.round(
    average(watched.map((movie) => Number(movie.runtime))),
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

