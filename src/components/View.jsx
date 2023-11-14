import { useState } from 'react';
import fetchDataService from '../services/fetchDataService';
import formatText from '../utils/stringUtil';

import './View.css';

const View = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const baseImgUrl = 'https://www.sverigetopplistan.se/img';

  const getTopSongs = async () => {
    try {
      const formattedDate = new Date(date).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const { success, chart, error } = await fetchDataService(formattedDate);
      if (success) {
        const songsArray = Array.isArray(chart) ? chart : Object.values(chart)[11];
        const topSong = songsArray.find((song) => song.avli === '1');
        setChartData(topSong ? [topSong] : []);
        setError('');
        setShowResult(true);
      } else {
        setChartData([]);
        setError(error);
      }  
    } catch (error) {
      console.error('Error:', error);
      setChartData([]);
      setError('Error fetching data. Please try again.');
    }
  };

  const handleBack = () => {
    setShowResult(false);
  };

  const shareSongWithFriends = () => {}; // Not implemented

  return (
    <div className="container">
      {!showResult && (
        <>
          <h1>TOP SONG OF THAT DAY</h1>
          <label htmlFor="dateInput">CHOOSE DATE:</label>
          <input
            type="date"
            id="dateInput"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className='button-container'>
            <button onClick={getTopSongs}>Search</button>
          </div>
        </>
      )}
      {showResult && (
        <div className="chart-container">
          {chartData.map((song, index) => (
            <div key={index} className="song-item">
              <img
                src={`${baseImgUrl}${song.kva}`}
                alt={`${formatText(song.tit)}${formatText(song.arso)}`}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  paddingLeft: '1.2em',
                  gap: '5px',
                  marginBottom: '2em',
                }}
              >
                <p
                  style={{
                    fontWeight: '900',
                    fontSize: '2.1em',
                    fontStyle: 'italic',
                  }}
                >
                  {formatText(song.tit)}
                </p>
                <p
                  style={{
                    fontWeight: '400',
                    fontSize: '1.7em',
                  }}
                >
                  {formatText(song.arso)}
                </p>
              </div>
            </div>
          ))}
          <div className='button-container'>
            <button onClick={handleBack}>Go Back</button>
            <button onClick={shareSongWithFriends}>Share with friends</button>
          </div>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default View;
