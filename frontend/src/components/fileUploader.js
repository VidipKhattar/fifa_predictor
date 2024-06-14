import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [probability, setProbability] = useState(null);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    hello: "hello",
    file: File,
  });

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setCredentials((prevFormData) => ({
      ...prevFormData,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);

    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/predict/"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/predict/",
        credentials,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProbability(response.data.probability);
      setError(null);
    } catch (err) {
      setError(err.response.data.error);
      setProbability(null);
    }
  };

  const handleURLChange = (e) => {
    console.log(e);
  };

  const handleURLSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);

    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/predict/"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/predict/",
        credentials,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProbability(response.data.probability);
      setError(null);
    } catch (err) {
      setError(err.response.data.error);
      setProbability(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <form onSubmit={handleURLSubmit}>
        <input type="url" onChange={handleURLChange} />
        <button type="submit">Upload</button>
      </form>
      {probability !== null && (
        <div>Probability of being a FIFA song: {probability * 100}%</div>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default FileUpload;
