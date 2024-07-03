import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ onSearchResultsChange, userAnswer }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (userAnswer == "") {
      setQuery("");
    }
  }, [userAnswer]);

  const handleChange = async (e) => {
    const search = e.target.value;
    const ending = "/search/?title=" + encodeURIComponent(search);
    setQuery(search);

    if (search.trim() === "") {
      setSuggestions([]);
      return;
    }

    clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(async () => {
      try {
        const get_response = await axios.get(
          process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_API_BASE_URL_PROD + ending
            : process.env.REACT_APP_API_BASE_URL_DEV + ending
        );
        const tracks = get_response.data["search_value"].map((result) => ({
          name: result.title,
          artist:
            result.artists && result.artists.length > 0
              ? result.artists[0].name
              : "",
          previewUrl: result.videoId,
          artwork: result.thumbnails[1].url,
          album: result.album.name,
          releaseDate: result.year,
        }));

        console.log(tracks);

        const uniqueTracks = tracks.filter(
          (track, index, self) =>
            index ===
            self.findIndex(
              (t) => t.name === track.name && t.artist === track.artist
            )
        );

        setSuggestions(uniqueTracks);
      } catch (error) {
        console.error("Error fetching song suggestions:", error);
      }
    }, 300);
    setTimeoutId(newTimeoutId);
  };

  const handleSelect = (song) => {
    setQuery(`${song.name} - ${song.artist}`);
    onSearchResultsChange(song);
    setSuggestions([]);
  };

  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
    onSearchResultsChange("");
  };

  return (
    <div className="relative">
      <div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for songs..."
          className="font-semibold w-full text-gray-600 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg py-2 px-4"
        />

        {query && (
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 focus:outline-none"
            onClick={handleClearSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 5.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 11-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      {query && suggestions.length > 0 && (
        <ul className="font-semibold text-gray-600  absolute top-full left-0 z-40 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg">
          {suggestions.map((song, index) => (
            <li
              key={`${song.name}-${song.artist}-${index}`}
              onClick={() => handleSelect(song)}
              className={`cursor-pointer py-1 px-2 hover:text-white transition-colors duration-250 rounded ${
                index < suggestions.length - 1
                  ? "border-b border-gray-600 text-gray-600  "
                  : ""
              }`}
            >
              {song.name} - {song.artist}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
