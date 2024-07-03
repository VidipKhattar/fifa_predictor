import React, { useState } from "react";
import axios from "axios";
import SearchBar from "./components/searchbar";
import SongTable from "./components/songTable";

const Main = () => {
  const [probability, setProbability] = useState(null);
  const [error, setError] = useState(null);
  const [file, setFile] = useState({
    file: File,
  });
  const [songData, setSongData] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setFile((prevFormData) => ({
      ...prevFormData,
      file: e.target.files[0],
    }));
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    console.log(file);

    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/predict/"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/predict/",
        file,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProbability(response.data.song_prob);
      setError(null);
    } catch (err) {
      setError(err.response.data.error);
      setProbability(null);
    }
  };

  const handleSamplerSearchResultsChange = (results) => {
    if (results) {
      setUserAnswer(results.name + "-" + results.artist);
      setSongData(results);
    } else {
      setUserAnswer("");
    }
  };

  const submitSongURl = async (results) => {
    setSearchLoading(true);
    console.log(songData.previewUrl);
    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/predict/"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/predict/",
        { songData }
      );
      setProbability(response.data.song_prob);
      setError(null);
    } catch (err) {
      setError(err.response.data.error);
      setProbability(null);
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div class="container mx-auto px-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <h1 class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500  to-purple-500">
          FIFA SONG CLASSIFIER
        </h1>
        <p className="text-gray-400">
          Welcome to FIFA Song Predictor, an innovative web app that analyzes
          your favorite songs to predict their likelihood of being featured in
          the next FIFA game. Upload a song, and our advanced machine learning
          model will provide a probability score indicating its potential to
          become a FIFA soundtrack hit. Try it out and see if your favorite tune
          has what it takes to make the cut!
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 py-4">
        <button className="bg-purple-500 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-blue-500 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg w-full font-bold text-white">
          Upload Mp3 File
        </button>
        <button className="bg-pink-500 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-blue-500 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg w-full font-bold text-white">
          Search for Song
        </button>
      </div>
      <div>
        <form onSubmit={handleFileSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        <SearchBar
          onSearchResultsChange={handleSamplerSearchResultsChange}
          userAnswer={userAnswer}
        />

        <button
          className="bg-blue-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg mb-10 w-full font-bold text-white"
          type="submit"
          onClick={submitSongURl}
          disabled={searchLoading}
        >
          {searchLoading ? (
            <div
              className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            ></div>
          ) : (
            "Submit"
          )}
        </button>
        {probability !== null && (
          <div>Probability of being a FIFA song: {probability * 100}%</div>
        )}
        {error && <div>Error: {error}</div>}
      </div>
      <div>
        <SongTable></SongTable>
      </div>
    </div>
  );
};

export default Main;
