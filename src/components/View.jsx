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
        if (topSong) {
          setChartData([topSong]);
          setError('');
        } else {
          setChartData([]);
          setError('There is no data for this date!');
        }
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
    setError('');
  };

  const shareSongWithFriends = () => {}; // Not implemented

  return (
    <div className="container">
      {!showResult && (
        <div>
          <h1>FIND CHART TOPPER TRACK OF THE DAY!</h1>
          <label htmlFor="dateInput">CHOOSE DATE:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className='button-container'>
            <button onClick={getTopSongs}>Search</button>
          </div>
        </div>
      )}
      {showResult && chartData.length > 0 && (
        <div className="chart-container">
          {chartData.map((song, index) => (
            <div key={index} className="song-card">
              <img
                src={`${baseImgUrl}${song.kva}`}
                alt={`${formatText(song.tit)}${formatText(song.arso)}`}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  padding: '0.8em',
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
              <div className='button-container'>
                <button onClick={handleBack}>Go Back</button>
                <button onClick={shareSongWithFriends}>Share with friends</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showResult && chartData.length === 0 && (
        <div className="error">
          <p style={{ color: 'white', textAlign: 'center', fontSize: '20px' }}>
            {error}
          </p>
          <div className='button-container'>
            <button onClick={handleBack}>Go Back</button>
          </div>
        </div>
      )}
      {error && !showResult && <p>{error}</p>}
    </div>
  );
};

export default View;
