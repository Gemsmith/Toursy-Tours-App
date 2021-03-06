import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getToursBySearchThunk, setCurrentPageValue } from '../redux/features/tourSlice';
import '../sass/components/Navbar.scss';
import searchIcon from '../assets/svg/search-icon.svg';
import toursyLogo from '../assets/images/toursy-logo.png';
import { toast } from 'react-toastify';
import { logoutThunk } from '../redux/features/authSlice';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const { loggedInUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutThunk());
  };

  // Menu Toggle Functionality:
  const avatarMenuElRef = useRef();
  const avatarBtnElRef = useRef();
  const hamburgerMenuElRef = useRef();
  const hamburgerBtnElRef = useRef();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      dispatch(getToursBySearchThunk(searchTerm));
      navigate(`/tour/search?searchQuery=${searchTerm}`);
      setSearchTerm('');
    } else {
      toast('Please enter a search term');
    }
  };

  useEffect(() => {
    let handler = (event) => {
      // Avatar Menu - Outside Click Toggle Logic
      if (
        !avatarMenuElRef.current?.contains(event.target) &&
        !avatarBtnElRef.current?.contains(event.target)
      ) {
        setAvatarMenuOpen(false);
      }

      // Hamburger Menu - Outside Click toggle Logic
      if (
        !hamburgerMenuElRef.current?.contains(event.target) &&
        !hamburgerBtnElRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);

    // This is a cleanup function, to prevent memory leaks
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  return (
    <div className="navbar">
      {/* Navbar - Desktop */}
      <div className="navbar__desktop">
        {/* Site Logo */}
        <Link to="/" className="navbar__logo-text">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
          </svg> */}
          <img src={toursyLogo} alt="toursy-logo" className="" />
        </Link>

        {/* Nav Links + User Avatar */}
        <nav className="navbar__desktop-links-and-avatar">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Search Tours"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="dodgerBlue"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>

          {/* Desktop View - Nav Links */}
          {/* On click will always make sure click on Home brings us back to page 1 */}
          <div className="navbar__desktop-links">
            <Link
              className="navLinks clr-black"
              to="/"
              onClick={() => dispatch(setCurrentPageValue(1))}
            >
              Home
            </Link>

            {/* <Link className="navLinks clr-black" to="/about">
              About
            </Link> */}
            {loggedInUser === null ||
            loggedInUser === undefined ||
            loggedInUser === '' ? (
              <>
                <Link className="navLinks clr-blue" to="/login">
                  Login
                </Link>
                <Link className="navLinks clr-blue" to="/signup">
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link className="navLinks clr-black" to="/addTour">
                  Add Tour
                </Link>
                <Link className="navLinks clr-black" to={`/user/${loggedInUser._id}`}>
                  Profile
                </Link>
                <Link className="navLinks clr-black" to="/dashboard">
                  Dashboard
                </Link>

                {/* Desktop View - User Avatar */}
                <span className="navbar__userAvatar">
                  <div
                    ref={avatarBtnElRef}
                    className="avatarPic"
                    onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  >
                    <img
                      className=""
                      src={loggedInUser?.profileImage}
                      referrerPolicy="no-referrer"
                      alt=""
                    />

                    {avatarMenuOpen && (
                      <ul className="avatarMenuDesktop">
                        <li>
                          <Link to={`/user/${loggedInUser._id}`}>
                            <b>{loggedInUser?.name}</b>
                          </Link>
                        </li>

                        <li>
                          <Link to={`/user/${loggedInUser._id}`}>
                            {loggedInUser?.email}
                          </Link>
                        </li>

                        <li className="avatarMenuDesktop-button">
                          <button onClick={() => logout()} className="navBtn ">
                            Logout
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </span>
              </>
            )}
          </div>
        </nav>

        {/* Hamburger Button */}
        <button
          ref={hamburgerBtnElRef}
          type="button"
          aria-label="Toggle mobile menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`navbar__hamburger-btn ${!menuOpen ? 'clr-black' : 'clr-blue'} `}
        >
          <svg
            className={`${menuOpen ? 'svg-fill-salmon' : ''}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Navbar - Mobile */}
      {menuOpen && (
        <nav className="navbar__mobile" ref={hamburgerMenuElRef}>
          {/* Mobile View - Nav Links */}
          <div className="navbar__mobile-navLinks">
            <Link className="navLinks clr-black" to="/">
              Home
            </Link>

            {loggedInUser === null ||
            loggedInUser === undefined ||
            loggedInUser === '' ? (
              <>
                <Link className="navLinks clr-blue" to="/login">
                  Login
                </Link>
                <Link className="navLinks clr-blue" to="/signup">
                  Signup
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search Tours"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="search-btn">
                    <img src={searchIcon} alt="" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link className="navLinks clr-black" to="/addTour">
                  Add Tour
                </Link>
                <Link className="navLinks clr-black" to={`/user/${loggedInUser._id}`}>
                  Profile
                </Link>
                <Link className="navLinks clr-black" to="/dashboard">
                  Dashboard
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search Tours"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="search-btn">
                    <img src={searchIcon} alt="" />
                  </button>
                </form>

                {/* Mobile View - User Avatar */}
                <ul className="avatarMenuMobile">
                  <div className="avatarMenuMobile-image-and-text">
                    <li>
                      <Link to={`/user/${loggedInUser._id}`}>
                        <img
                          className=""
                          src={loggedInUser?.profileImage}
                          referrerPolicy="no-referrer"
                          alt=""
                        />
                      </Link>
                    </li>
                    <div className="avatarMenuMobile-text">
                      <li>
                        <Link to={`/user/${loggedInUser._id}`}>
                          <b>{loggedInUser?.name}</b>
                        </Link>
                      </li>

                      <li>
                        <Link to={`/user/${loggedInUser._id}`}>
                          {loggedInUser?.email}
                        </Link>
                      </li>
                    </div>
                  </div>

                  <li className="avatarMenuMobile-button">
                    <button onClick={() => logout()} className="navBtn">
                      Logout
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
