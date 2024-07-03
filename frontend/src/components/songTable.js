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
        console.log(response);
        setSongGuess(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching song guesses:", error);
        setLoading(false);
      });
  }, []);

  const renderSongGuess = () => {
    return songGuess.map((song) => (
      <tr key={song.id} className={"border-b border-gray-200"}>
        <td className="py-4 px-6">{song.id}</td>
        <td className="py-4 px-6">
          <a href={song.song_link}>{song.song_name}</a>
        </td>
        <td className="py-4 px-6">{song.song_artist}</td>
        <td className="py-4 px-6">{song.song_prob}</td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto px-4 text-center">
      <div className="overflow-auto ">
        <table className="table-auto w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg text-center">
          <thead>
            <tr>
              <th className="py-4 px-6"></th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Artist</th>
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
