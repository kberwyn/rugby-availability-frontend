import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://vipersavailability-production.up.railway.app';

function App() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Fetch data when component loads
    fetchPlayers();
    fetchMatches();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players`);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/matches`);
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  return (
    <div className="App">
      <h1>Rugby Club Availability</h1>
      
      <div>
        <h2>Players ({players.length})</h2>
        {players.map(player => (
          <div key={player.id}>
            {player.first_name} {player.last_name} - {player.positions}
          </div>
        ))}
      </div>

      <div>
        <h2>Upcoming Matches</h2>
        {matches.map(match => (
          <div key={match.id}>
            vs {match.opponent} on {match.date} at {match.time}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
