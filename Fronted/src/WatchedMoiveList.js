const WatchedMoiveList = ({ watched, handle_delete }) => {
    return (
      <ul className="list">
        {watched.map((movie) => (
          <li key={movie.imdbid}>
            {console.log(movie.imdbid)}
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{Number(movie.imdbrating)}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userrating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime} min</span>
              </p>
              <button
                className="btn-delete"
                onClick={() => handle_delete(movie.imdbid)}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  export default WatchedMoiveList
  