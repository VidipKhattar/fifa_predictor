import axios from "axios";
import SearchBar from "./components/searchbar";
import SongTable from "./components/songTable";
import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Fade from "react-reveal/Fade";

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

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
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
      console.log(response);
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
    console.log(songData.previewUrl);
    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/predict/"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/predict/",
        { songData }
      );
      setProgress(100);
      console.log(response);
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

  useEffect(() => {
    const socket = new WebSocket(
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_WS_BASE_URL_PROD + "/ws/progress/"
        : "ws://localhost:8000/ws/progress/"
    );
    console.log(socket);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let number = data["message"] * 2;
      setProgress(number);
      if (number < 10 && number > 1) {
        setLoadingMessage(loadingMessages[0]);
      } else if (number > 9 && number < 69) {
        let numStr = number.toString();
        setLoadingMessage(loadingMessages[parseInt(numStr[0])]);
      } else {
        setLoadingMessage(loadingMessages[6]);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      <div className="container mx-auto px-6 py-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 sm:m-5">
          <h1 className="text-2xl md:text-5xl lg:text-6xl italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500  to-purple-500">
            FIFA SONG PREDICTOR
          </h1>
          <p className="text-gray-400">
            <span className="block md:hidden text-sm">
              Analyze your favorite songs to predict their likelihood of being
              in the next FIFA. Upload/Search a song to see its potential!
            </span>
            <span className="hidden md:block lg:hidden">
              Welcome to FIFA Song Predictor. Analyze your favorite songs to
              predict their likelihood of being in the next FIFA/EA FC game.
              Upload/Search a song to see its potential!
            </span>
            <span className="hidden lg:block xl:hidden">
              Welcome to FIFA Song Predictor, an innovative web app that
              analyzes your favorite songs to predict their likelihood of being
              featured in the next FIFA/EA FC game. Upload/Search a song, and
              our advanced machine learning model will provide a probability
              score indicating its potential to become a FIFA soundtrack hit.
            </span>
            <span className="hidden xl:block">
              Welcome to FIFA Song Predictor, an innovative web app that
              analyzes your favorite songs to predict their likelihood of being
              featured in the next FIFA/EA FC game. Search/Upload a song, and
              our advanced machine learning model will provide a probability
              score indicating its potential to become a FIFA soundtrack hit.
              Try it out and see if your favorite tune has what it takes to make
              the cut!
            </span>
          </p>
        </div>
        <Fade bottom duration={1200}>
          <div className="grid grid-cols-2 gap-4 pt-2 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 ">
            <button onClick={() => setCurrentForm("search")}>
              <span
                className={`${
                  currentForm === "search" ? "font-bold italic" : ""
                } hover:font-bold hover:italic`}
              >
                Search search
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
        </Fade>
        <div>
          <Fade bottom duration={1200}>
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
                    className="min-[400px]:bg-violet-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg min-[400px]:p-2 rounded-xl shadow-lg  w-full text-white"
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
          </Fade>
          {currentForm === "search" && (
            <div className="grid grid-cols-4 gap-4 pb-4">
              <div className=" col-span-3">
                <SearchBar
                  onSearchResultsChange={handleSamplerSearchResultsChange}
                  userAnswer={userAnswer}
                />
              </div>

              <button
                className="min-[400px]:bg-violet-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg min-[400px]:p-2 rounded-xl shadow-lg  w-full text-white"
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
                  "Analyse"
                )}
              </button>
            </div>
          )}

          <div>
            {searchLoading && currentForm == "search" && (
              <div className="">
                <div>
                  <p className="text-gray-400 text-center">{loadingMessage}</p>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                ></LinearProgress>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-center md:text-left ">
            <div>
              {songResponse !== null && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-5">
                    <div>
                      <Fade left duration={1500}>
                        <h3 className="min-[400px]:text-5xl italic font-bold">
                          {parseInt(songResponse.song_prob * 100)}%
                        </h3>
                        <p> Probability of being a FIFA song</p>
                      </Fade>
                      <Fade left duration={1300}>
                        <h1 className="min-[400px]:text-3xl italic font-bold pt-2 ">
                          {songResponse.song_name}
                        </h1>
                        <h2 className="min-[400px]:text-xl italic font-bold">
                          {songResponse.song_artist}
                        </h2>
                      </Fade>
                    </div>
                    <Fade left duration={1200}>
                      <div className="flex justify-center items-center rounded-xl">
                        <img
                          src={songResponse.song_cover}
                          style={{ maxWidth: "100%", maxHeight: "200px" }}
                          alt="alt.png"
                          className="rounded-2xl"
                        />
                      </div>
                    </Fade>
                  </div>
                  <Fade left duration={1300}>
                    <p className="m-5">
                      {parseInt(percentile)} percentile of searched songs
                    </p>
                  </Fade>
                  <Fade left duration={1600}>
                    <p className="m-5">
                      Check the table for a list of songs previous users have
                      analysed and their FIFA likelihood
                    </p>
                  </Fade>
                </div>
              )}
              {error && <div>Error: {error}</div>}
            </div>
            <div className="py-2">
              <Fade bottom duration={1500}>
                <SongTable></SongTable>
              </Fade>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
