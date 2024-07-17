# FIFA Song Predictor

[FifaPredictor](https://website-name.com)

## Purpose

FIFA Song Predictor is a web application designed to analyze songs and predict their likelihood of being featured in the next FIFA/EA FC game. 
By leveraging advanced machine learning models, it provides users with a probability score indicating the potential of their favorite songs becoming FIFA soundtrack hits.

## Why Use FIFA Song Predictor?

- **Music Enthusiasts**: Discover the probability of your favorite tracks making it to the FIFA playlist.
- **Game Developers**: Analyze potential soundtracks for FIFA games.
- **Music Industry**: Identify songs with high potential for sports game soundtracks.

## How It Works

### Features

1. **Upload or Search Songs**: Users can either upload audio files or search for songs via YouTube.
2. **Audio Processing**: Utilizes `librosa` and `ffmpeg` for audio feature extraction.
3. **Machine Learning**: Applies pre-trained models to predict the likelihood of a song being included in FIFA.
4. **Percentile Calculation**: Compares the probability of a song with previously analyzed tracks to provide percentile ranking.

### Technology Stack

- **Frontend**: Built with React for an interactive user interface.
- **Backend**: Developed with Django Rest Framework to handle API requests.
- **Audio Analysis**: `librosa`, `pydub`, and `ffmpeg` are used for feature extraction from audio files.
- **Data Handling**: `pandas` and `numpy` for data processing and manipulation.
- **APIs**: Uses `ytmusicapi` for song search and `pytube` for video length retrieval.

### Usage

1. **Search for Songs**: Enter the song title to fetch potential matches from YouTube.
2. **Upload a File**: Choose an audio file to analyze.
3. **Get Predictions**: Receive a probability score and percentile ranking for the analyzed song.
4. **Explore Results**: View a table of songs analyzed by other users and their FIFA likelihood.

## Setup and Installation

### Prerequisites

- Python 3.x
- Node.js and npm
- Docker (optional for containerized deployment)


