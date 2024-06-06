/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import './MovieCard.css'

function MovieCard({ movieData }) {

  return (
      <section className="card_container">
          {movieData.map((movie) => (
            <div
              className='card_movie-container'
              key={movie.id}
              >
              <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none"}} >
                  <img
                  className='card_movie-img'
                  alt="영화 이미지"
                  src={`http://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                  />
                  <p className='card_movie-title'>
                    {movie.title}
                  </p>
              </Link>
              <p className='card_movie-vote_average'>
                {movie.vote_average}
              </p>
            </div>
          ))}
      </section>
  );
}

export default MovieCard;