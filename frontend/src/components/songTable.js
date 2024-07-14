import React, { useState, useEffect } from "react";
import axios from "axios";

function SongTable() {
  const [songGuess, setSongGuess] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_API_BASE_URL_PROD}/predict`
          : `${process.env.REACT_APP_API_BASE_URL_DEV}/predict`
      )
      .then((response) => {
        const sortedSongs = [...response.data].sort(
          (a, b) => b.song_prob - a.song_prob
        );
        setSongGuess(sortedSongs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching song guesses:", error);
        setLoading(false);
      });
  }, []);

  const renderSongGuess = () => {
    return songGuess.map((song) => (
      <tr
        key={song.id}
        className={" text-xs md:text-sm lg:text-lg border-b border-black "}
      >
        <td className="py-4 px-6 hover:underline hover:text-white hover:bg-opacity-80 transition-colors duration-200">
          <a
            className=""
            target="_blank"
            rel="noreferrer"
            href={song.song_link}
          >
            {song.song_name + " - " + song.song_artist}
          </a>
        </td>
        <td className="py-4 px-6">{Math.round(100 * song.song_prob)}%</td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto">
      <div className="overflow-auto max-h-96 text-black rounded-2xl ">
        <table className="table-auto w-full bg-white bg-opacity-25  backdrop-filter backdrop-blur-lg shadow-lg text-center">
          <thead>
            <tr className="">
              <th className="py-4 px-6">Song Title</th>
              <th className="py-4 px-6">Probability</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8">
                  <div className="flex justify-center items-center">
                    <div
                      className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                      role="status"
                    ></div>
                  </div>
                </td>
              </tr>
            ) : (
              renderSongGuess()
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SongTable;
