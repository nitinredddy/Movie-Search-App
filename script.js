const API_KEY = '795fffa4'; // Replace with your actual OMDb API key
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const movieDetailsDiv = document.getElementById('movieDetails');

searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    searchMovies(searchTerm);
  } else {
    resultsDiv.innerHTML = '<p>Please enter a movie title to search.</p>';
    movieDetailsDiv.innerHTML = '';
  }
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchButton.click();
  }
});

async function searchMovies(query) {
  try {
    resultsDiv.innerHTML = '<p>Loading...</p>';
    movieDetailsDiv.innerHTML = '';
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();
    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      resultsDiv.innerHTML = `<p>No movies found. Please try again.</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    resultsDiv.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
  }
}

function displayMovies(movies) {
  resultsDiv.innerHTML = '';
  movies.forEach(movie => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');
    movieItem.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>Year: ${movie.Year}</p>
    `;
    movieItem.addEventListener('click', () => fetchMovieDetails(movie.imdbID));
    resultsDiv.appendChild(movieItem);
  });
}

async function fetchMovieDetails(id) {
  try {
    movieDetailsDiv.innerHTML = '<p>Loading details...</p>';
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
    const movie = await response.json();
    displayMovieDetails(movie);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    movieDetailsDiv.innerHTML = `<p>Could not load movie details.</p>`;
  }
}

function displayMovieDetails(movie) {
  movieDetailsDiv.innerHTML = `
    <h2>${movie.Title}</h2>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <p><strong>Cast:</strong> ${movie.Actors}</p>
  `;
}
