import axios from "axios";
import SearchBar from "./components/searchbar";
import SongTable from "./components/songTable";
import React, { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { motion } from "framer-motion";

const loadingMessages = [
  "Downloading Song",
  "Getting Streams",
  "Writing chunks to buffer",
  "Preprocessing audio",
  "Extracting features",
  "Employing ML Model",
  "Fetching Probability",
];

const Main = () => {
  const [songResponse, setSongResponse] = useState(null);
  const [error, setError] = useState(null);
  const [file, setFile] = useState({ file: File });
  const [songData, setSongData] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentForm, setCurrentForm] = useState("search");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [percentile, setPercentile] = useState(null);
  //const [videoLength, setVideoLength] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFile((prevFormData) => ({
      ...prevFormData,
      file: e.target.files[0],
    }));
  };

  const handleFileSubmit = async (e) => {
    setSearchLoading(true);
    e.preventDefault();
    setSongResponse(null);
    setProgress(0);
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
      setSongResponse(response.data["songDict"]);
      setPercentile(response.data["percentile"]);
      setError(null);
    } catch (err) {
      setError(err.response.data.error);
      setSongResponse(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const submitSongURl = async (results) => {
    setSongResponse(null);
    setSearchLoading(true);
    setProgress(0);
    try {
      const videoLength = await getVideoDuration(songData.previewUrl);
      progressBarIncrement(videoLength);
      console.log(process.env.REACT_APP_API_BASE_URL_PROD);
      console.log(process.env.REACT_APP_API_BASE_URL_DEV);
      const response = await axios.post(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/predict/"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/predict/",
        { songData }
      );
      setProgress(100);
      setSongResponse(response.data["songDict"]);
      setPercentile(response.data["percentile"]);

      setError(null);
    } catch (err) {
      setError(err.response.data.error);
      setSongResponse(null);
      console.log(error);
    } finally {
      setSearchLoading(false);
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

  const getVideoDuration = async (videoId) => {
    try {
      const response = await axios.get(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_API_BASE_URL_PROD}/length/?videoId=${videoId}`
          : `${process.env.REACT_APP_API_BASE_URL_DEV}/length/?videoId=${videoId}`
      );
      const length = response.data["video_length"];
      setError(null);
      return length;
    } catch (err) {
      console.error(err);
      setError(err.response.data.error);
    }
  };

  const progressBarIncrement = (videoLength) => {
    const timeShould = videoLength / 2;
    const increment = 10 / timeShould;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + increment, 100);
        if (isNaN(newProgress)) {
          console.error("Progress is NaN");
          clearInterval(interval);
          return prev; // Return the previous progress if there's an error
        }
        if (newProgress >= 100) {
          clearInterval(interval);
        }
        if (newProgress < 10 && newProgress > 1) {
          setLoadingMessage(loadingMessages[0]);
        } else if (newProgress > 9 && newProgress < 69) {
          let numStr = newProgress.toString();
          setLoadingMessage(loadingMessages[parseInt(numStr[0])]);
        } else {
          setLoadingMessage(loadingMessages[6]);
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Main Content */}
        <div className="container mx-auto px-6 py-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 sm:m-5">
            <motion.div
              className="box"
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 100, opacity: 0 }}
              transition={{
                y: { type: "spring", duration: 0.9 },
                opacity: { duration: 0.9 },
              }}
            >
              <h1 className="text-2xl md:text-5xl lg:text-6xl italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                FIFA SONG PREDICTOR
              </h1>
            </motion.div>
            <motion.div
              className="box"
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 100, opacity: 0 }}
              transition={{
                y: { type: "spring", duration: 0.9 },
                opacity: { duration: 0.9 },
              }}
            >
              <p className="text-gray-400">
                <span className="block md:hidden text-sm">
                  Analyze your favorite songs to predict their likelihood of
                  being in the next FIFA. Upload/Search a song to see its
                  potential!
                </span>
                <span className="hidden md:block lg:hidden">
                  Welcome to FIFA Song Predictor. Analyze your favorite songs to
                  predict their likelihood of being in the next FIFA/EA FC game.
                  Upload/Search a song to see its potential!
                </span>
                <span className="hidden lg:block xl:hidden">
                  Welcome to FIFA Song Predictor, an innovative web app that
                  analyzes your favorite songs to predict their likelihood of
                  being featured in the next FIFA/EA FC game. Upload/Search a
                  song, and our advanced machine learning model will provide a
                  probability score indicating its potential to become a FIFA
                  soundtrack hit.
                </span>
                <span className="hidden xl:block">
                  Welcome to FIFA Song Predictor, an innovative web app that
                  analyzes your favorite songs to predict their likelihood of
                  being featured in the next FIFA/EA FC game. Search/Upload a
                  song, and our advanced machine learning model will provide a
                  probability score indicating its potential to become a FIFA
                  soundtrack hit. Try it out and see if your favorite tune has
                  what it takes to make the cut!
                </span>
              </p>
            </motion.div>
          </div>
          <motion.div
            className="box"
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: 100, opacity: 0 }}
            transition={{
              y: { type: "spring", duration: 1.2 },
              opacity: { duration: 1.2 },
            }}
          >
            <div className="grid grid-cols-2 gap-4 pt-2 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              <button onClick={() => setCurrentForm("search")}>
                <span
                  className={`${
                    currentForm === "search" ? "font-bold italic" : ""
                  } hover:font-bold hover:italic`}
                >
                  Search
                </span>
              </button>
              <button onClick={() => setCurrentForm("upload")}>
                <span
                  className={`${
                    currentForm === "upload" ? "font-bold italic" : ""
                  } hover:font-bold hover:italic`}
                >
                  Upload File
                </span>
              </button>
            </div>
          </motion.div>
          <div>
            {currentForm === "upload" && (
              <div className="pb-4">
                <form
                  className="grid grid-cols-4 gap-4"
                  onSubmit={handleFileSubmit}
                >
                  <input
                    className="col-span-3"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <button
                    className="min-[400px]:bg-violet-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg min-[400px]:p-2 rounded-xl shadow-lg w-full text-white"
                    type="submit"
                  >
                    {searchLoading ? (
                      <div
                        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status"
                      ></div>
                    ) : (
                      "Analyse"
                    )}
                  </button>
                </form>
              </div>
            )}
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 100, opacity: 0 }}
              transition={{
                y: { type: "spring", duration: 1.4 },
                opacity: { duration: 1.4 },
              }}
            >
              {currentForm === "search" && (
                <div className="grid grid-cols-4 gap-4 pb-4">
                  <div className="col-span-3">
                    <SearchBar
                      onSearchResultsChange={handleSamplerSearchResultsChange}
                      userAnswer={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                  </div>
                  <button
                    className={`min-[400px]:bg-violet-600 ${
                      !userAnswer
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-opacity-80"
                    } transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg min-[400px]:p-2 rounded-xl shadow-lg w-full text-white`}
                    type="submit"
                    onClick={submitSongURl}
                    disabled={!userAnswer || searchLoading}
                  >
                    {searchLoading ? (
                      <div
                        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status"
                      ></div>
                    ) : (
                      "Analyse"
                    )}
                  </button>
                </div>
              )}
            </motion.div>
            <div>
              {searchLoading && currentForm === "search" && (
                <div>
                  <div>
                    <p className="text-gray-400 text-center">
                      {loadingMessage}
                    </p>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                  ></LinearProgress>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-center md:text-left">
              <div>
                {songResponse !== null && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-5">
                      <div>
                        <motion.div
                          animate={{ x: 0, opacity: 1 }}
                          initial={{ x: -100, opacity: 0 }}
                          transition={{
                            x: { type: "spring", duration: 1.5 },
                            opacity: { duration: 1.5 },
                          }}
                        >
                          <h3 className="min-[400px]:text-5xl italic font-bold">
                            {parseInt(songResponse.song_prob * 100)}%
                          </h3>
                          <p> Probability of being a FIFA song</p>
                        </motion.div>
                        <motion.div
                          animate={{ x: 0, opacity: 1 }}
                          initial={{ x: -100, opacity: 0 }}
                          transition={{
                            x: { type: "spring", duration: 1.3 },
                            opacity: { duration: 1.3 },
                          }}
                        >
                          <h1 className="min-[400px]:text-3xl italic font-bold pt-2">
                            {songResponse.song_name}
                          </h1>
                          <h2 className="min-[400px]:text-xl italic font-bold">
                            {songResponse.song_artist}
                          </h2>
                        </motion.div>
                      </div>
                      <motion.div
                        animate={{ x: 0, opacity: 1 }}
                        initial={{ x: -100, opacity: 0 }}
                        transition={{
                          x: { type: "spring", duration: 1.2 },
                          opacity: { duration: 1.2 },
                        }}
                      >
                        <div className="flex justify-center items-center rounded-xl">
                          <img
                            src={songResponse.song_cover}
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                            alt="alt.png"
                            className="rounded-2xl"
                          />
                        </div>
                      </motion.div>
                    </div>
                    <motion.div
                      animate={{ x: 0, opacity: 1 }}
                      initial={{ x: -100, opacity: 0 }}
                      transition={{
                        x: { type: "spring", duration: 1.3 },
                        opacity: { duration: 1.3 },
                      }}
                    >
                      <p className="m-5">
                        {parseInt(percentile)} percentile of searched songs
                      </p>
                    </motion.div>{" "}
                    <motion.div
                      animate={{ x: 0, opacity: 1 }}
                      initial={{ x: -100, opacity: 0 }}
                      transition={{
                        x: { type: "spring", duration: 1.6 },
                        opacity: { duration: 1.6 },
                      }}
                    >
                      <p className="m-5">
                        Check the table for a list of songs previous users have
                        analysed and their FIFA likelihood
                      </p>
                    </motion.div>{" "}
                  </div>
                )}
                {error && <div>Error: {error}</div>}
              </div>
              <div className="py-2">
                <motion.div
                  animate={{ y: 0, opacity: 1 }}
                  initial={{ y: 100, opacity: 0 }}
                  transition={{
                    y: { type: "spring", duration: 1.6 },
                    opacity: { duration: 1.6 },
                  }}
                >
                  <SongTable />
                </motion.div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>
          Created by Vidip Khattar |{" "}
          <a
            href="https://github.com/VidipKhattar/fifa_predictor"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Main;
