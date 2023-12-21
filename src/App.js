import React, { useEffect, useState } from 'react';
import './App.css';
import ReactPaginate from 'react-paginate';
import Searching from './components/Searching';
import Filter from './components/Filter';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>

  );
};

function App() {
  const [movie, setMovie] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNext, setshowNext] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [names, setNames] = useState([]);
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStars, setSelectedStars] = useState([]);
  const [movieRatings, setMovieRatings] = useState({});
  const [savedMovies, setSavedMovies] = useState([]);
  const [isFavoriteMode, setIsFavoriteMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleAddToSaved = () => {
    if (selectedMovie) {
      // Ambil data film yang sudah disimpan dari localStorage
      const storedSavedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

      // Periksa apakah film sudah ada dalam daftar
      const isMovieAlreadySaved = storedSavedMovies.some(movie => movie.id === selectedMovie.id);

      if (!isMovieAlreadySaved) {
        // Jika belum ada, tambahkan film ke daftar
        const updatedSavedMovies = [...storedSavedMovies, selectedMovie];
        setSavedMovies(updatedSavedMovies);

        // Simpan data ke localStorage
        localStorage.setItem('savedMovies', JSON.stringify(updatedSavedMovies));

      }
      setSaveMessage('Data berhasil disimpan');

      // Redirect setelah 1 detik
      setTimeout(() => {
        window.location = document.referrer;
      }, 1000);
    }
  };

  const checkIdMovie = (id) => {
    const storedSavedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    // Periksa apakah film sudah ada dalam daftar
    return storedSavedMovies.some(movie => movie.id === selectedMovie.id);

  }

  const handleMyFavoriteClick = () => {
    setIsFavoriteMode(!isFavoriteMode);
    const getSaveMovie = JSON.parse(localStorage.getItem('savedMovies'));
    if (getSaveMovie) {
      setMovie(getSaveMovie);
    }
  };

  const handleRemoveFromSaved = (movieId) => {
    // Ambil data film yang sudah disimpan dari localStorage
    const storedSavedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    // Periksa apakah film dengan ID tertentu sudah ada dalam daftar
    const isMovieAlreadySaved = storedSavedMovies.some(movie => movie.id === movieId);

    if (isMovieAlreadySaved) {
      // Jika ada, hapus film dari daftar
      const updatedSavedMovies = storedSavedMovies.filter(movie => movie.id !== movieId);

      // Simpan data ke localStorage
      localStorage.setItem('savedMovies', JSON.stringify(updatedSavedMovies));


      // Redirect setelah 3 detik
      setTimeout(() => {
        setSaveMessage('Data berhasil dihapus');
        window.location = document.referrer;
      }, 3000);
    }
  };

  const handleStarClick = (index) => {
    // Lakukan sesuatu ketika bintang diklik
    if (!selectedMovie) return;

    const movieId = selectedMovie.id;
    const isSelected = movieRatings[movieId]?.includes(index);

    setMovieRatings((prevRatings) => {
      const prevMovieRatings = prevRatings[movieId] || [];
      const updatedRatings = isSelected
        ? prevMovieRatings.filter((rating) => rating !== index)
        : [...prevMovieRatings, index];

      return { ...prevRatings, [movieId]: updatedRatings };
    });

    // Simpan data ke localStorage
    localStorage.setItem('selectedStars', JSON.stringify(selectedStars));
  };

  const fetchMovie = async () => {
    console.log(movie);
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=27bd4dad0754c77391111e35f827bd6a')
      .then(response => response.json())
      .then(json => setMovie(json.results))
  }
  useEffect(() => {
    fetchMovie();
    const storedRatings = JSON.parse(localStorage.getItem('movieRatings'));
    if (storedRatings) {
      setMovieRatings(storedRatings);
    }
    const getSaveMovie = JSON.parse(localStorage.getItem('savedMovies'));
    if (getSaveMovie) {
      setMovie(getSaveMovie);
    }
    if (saveMessage) {
      // Set timeout untuk menghilangkan pesan setelah 5 detik
      const timeoutId = setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const search = async (q) => {
    const storedSavedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    const foundMovie = storedSavedMovies.find(movie => movie.id.toString() === q);

    if (foundMovie) {
      // Jika film yang dicari ada di film yang disimpan
      setMovie([foundMovie]); // Hanya set film yang ditemukan
    } else {
      // Jika film yang dicari tidak ada di film yang disimpan, lakukan pencarian baru
      const URL = `https://api.themoviedb.org/3/search/movie?query=${q}&api_key=27bd4dad0754c77391111e35f827bd6a`;
      const response = await fetch(URL);
      const data = await response.json();

      if (data.results) {
        setMovie(data.results);
      }
    }
  };

  const handleCommentSubmit = () => {
    if (name && comment) {
      setNames([...names, name]);
      setComments([...comments, comment]);
      setName(''); // Clear the name input
      setComment(''); // Clear the comment input
    }
    setShowForm(false);
  };


  const detail = async (id) => {
    const URL = `https://api.themoviedb.org/3/movie/${id}?api_key=27bd4dad0754c77391111e35f827bd6a`;
    const response = await fetch(URL);
    const data = await response.json();
    setSelectedMovie(data);
    setShowForm(false);
  }

  const handlePage = async (page) => {
    page.selected += 1;
    console.log(page.selected);
    const URL = `https://api.themoviedb.org/3/discover/movie?api_key=27bd4dad0754c77391111e35f827bd6a&page=${page.selected}`;
    const response = await fetch(URL);
    const data_page = await response.json();
    if (page.selected > 0) {
      setMovie(data_page.results);
      if (page.selected === 1) {
        setShowPrevious(false);
        setshowNext(true);
      } else {
        setShowPrevious(true);
        if (page.selected === 6) {
          setshowNext(false);
        } else {
          setshowNext(true);
        }
      }
    }

    setShowForm(true);
  }
  const refresh = async () => {
    window.location.href = '/';
  }
  const refreshPage = async () => {
    localStorage.setItem('movieRatings', JSON.stringify(movieRatings));
    //localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
    window.location = document.referrer;
  };

  return (
    <>
      <>
        {selectedMovie !== null ? (

          <div className="detail-container">
            <div className="card-container">
              <a href="/" className="hero-image-container">
                <img className="detail-image" src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} />
              </a>
              <main className="main-content">
                <h2>{selectedMovie.title}</h2>
                <p>{selectedMovie.overview}</p>
                <p>Release Date : {selectedMovie.release_date}</p>
                <p>Duration: {(selectedMovie.runtime - (selectedMovie.runtime % 60)) / 60} Jam {selectedMovie.runtime % 60} Menit</p>
                <p>Status: {selectedMovie.status}</p>
                <div className="container">
                  <div className="container__items">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                      <div
                        key={index}
                        className={`star-stroke ${movieRatings[selectedMovie.id]?.includes(index) ? 'selected' : ''}`}
                        onClick={() => handleStarClick(index)}
                      >
                        <div className="star-fill">&#9733;</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className='button-5' onClick={refreshPage}>Kembali</button>
                {!isFavoriteMode && (
                  <button className='button-4' onClick={handleAddToSaved}>Tambah</button>
                )}
                {isFavoriteMode && (
                  <button className='button-3' onClick={handleRemoveFromSaved(selectedMovie.id)}>Hapus My Favorite</button>
                )}
                {saveMessage && <p>{saveMessage}</p>}
                {comments.length > 0 && (
                  <button className="open-modal-button modal-button" onClick={handleOpenModal}>
                    Lihat Komentar
                  </button>
                )}

                <input
                  className="input-name"
                  type="text"
                  id="nama"
                  placeholder="Masukkan nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <div className="comment-container">
                  <textarea
                    className="comment-box"
                    placeholder="Tambahkan komentar Anda..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <button className="submit-button" onClick={handleCommentSubmit}>
                    Submit
                  </button>

                </div>


              </main>

            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
              {comments.length > 0 && (
                <div className="comments">
                  <h3>Isi komentar</h3>
                  {comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <p>
                        <strong>{names[index]}:</strong> {comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Modal>
          </div>
        ) : (
          <>
            <Searching showForm={showForm} search={search} />

            {!isFavoriteMode && (
              <>
                <Filter setMovie={setMovie} />
                <button className="submit-button my-favorite" onClick={handleMyFavoriteClick}>
                  My Favorite
                </button>
              </>
            )}
            {isFavoriteMode && (
              <button className="submit-button show-all" onClick={refreshPage}>
                Tampilkan Semua
              </button>
            )}

            <div className="card-container">
              {/* Tampilkan daftar gambar */}
              {movie.map((val, index) => (
                <div className="card" key={index}>
                  <div className="wrapper" onClick={() => detail(val.id)}>
                    <img src={`https://image.tmdb.org/t/p/w500/${val.poster_path}`} className="cover-image" alt={val.title} />
                  </div>
                </div>
              ))}

              {!isFavoriteMode && (

                <div className='paginate-container' >
                  <div className='paginate'>
                    {showPrevious ? (

                      <ReactPaginate
                        previousLabel={showPrevious ? 'Previous' : ''}
                        nextLabel={showNext ? 'Next' : ''}
                        pageCount={6}
                        marginPagesDisplayed={4}
                        pageRangeDisplayed={3}
                        onPageChange={handlePage}
                        containerClassName={'paginate-container'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                      />
                    ) : (
                      <ReactPaginate
                        nextLabel={showNext ? 'Next' : ''}
                        pageCount={6}
                        marginPagesDisplayed={4}
                        pageRangeDisplayed={3}
                        onPageChange={handlePage}
                        containerClassName={'paginate-container'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </>
    </>
  );
}

export default App;