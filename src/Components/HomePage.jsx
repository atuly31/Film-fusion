import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const StyledCard = styled(Card)(({ poster }) => ({
  height: '59rem',
  width: '42rem',
  backgroundImage: `url(${poster})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  borderRadius: '0.9rem',
  overflow: 'hidden',
}));

const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const MovieCarousel = () => {
  const [index, setIndex] = useState(0);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/trending/movie/week?api_key=1d39a93a74608e12f6cce093386334bb'
        );
        setMovies(response.data.results); 
      } catch (err) {
        console.error('Error fetching movies:', err.message);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % movies.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [movies.length]);

  if (movies.length === 0) {
    return <Typography variant="h5">Loading movies...</Typography>;
  }

  const currentMovie = movies[index];
  const genres = currentMovie.genre_ids.map((id) => genreMap[id]).join(', ');

  return (
    <div className="box">
      <StyledCard poster={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}>
        <CardContent>
          <Typography variant="h3">{currentMovie.title}</Typography>
          <Typography variant="h5">Genres: {genres}</Typography>
          <Typography variant="body1">{currentMovie.overview}</Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary">
            Play
          </Button>
          <Button
            variant="outlined"
            href={`https://www.themoviedb.org/movie/${currentMovie.id}`}
            target="_blank"
          >
            More Info
          </Button>
        </CardActions>
      </StyledCard>
    </div>
  );
};

export default MovieCarousel;
