import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://your-actual-railway-url.up.railway.app';

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [playerData, setPlayerData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    positions: ''
  });
  const [availability, setAvailability] = useState('available');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/matches`);
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First, try to find existing player by email
      let playerId;
      try {
        const playerResponse = await axios.get(`${API_URL}/api/players/email/${playerData.email}`);
        playerId = playerResponse.data.id;
        setMessage('Found existing player record');
      } catch (error) {
        // Player doesn't exist, create new one
        const newPlayerResponse = await axios.post(`${API_URL}/api/players`, playerData);
        playerId = newPlayerResponse.data.id;
        setMessage('Created new player record');
      }

      // Submit availability
      await axios.post(`${API_URL}/api/availability`, {
        player_id: playerId,
        match_id: selectedMatch,
        availability: availability,
        notes: notes
      });

      setMessage(prev => prev + ' - Availability submitted successfully!');
      
      // Reset form
      setPlayerData({ first_name: '', last_name: '', email: '', phone: '', positions: '' });
      setNotes('');
      setSelectedMatch('');
      
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      <h1>Rugby Availability</h1>
      
      <form onSubmit={handleSubmit}>
        <h2>Your Information</h2>
        
        <div style={{marginBottom: '10px'}}>
          <label>First Name:</label><br/>
          <input 
            type="text" 
            value={playerData.first_name}
            onChange={(e) => setPlayerData({...playerData, first_name: e.target.value})}
            required
            style={{width: '100%', padding: '8px'}}
          />
        </div>

        <div style={{marginBottom: '10px'}}>
          <label>Last Name:</label><br/>
          <input 
            type="text" 
            value={playerData.last_name}
            onChange={(e) => setPlayerData({...playerData, last_name: e.target.value})}
            required
            style={{width: '100%', padding: '8px'}}
          />
        </div>

        <div style={{marginBottom: '10px'}}>
          <label>Email:</label><br/>
          <input 
            type="email" 
            value={playerData.email}
            onChange={(e) => setPlayerData({...playerData, email: e.target.value})}
            required
            style={{width: '100%', padding: '8px'}}
          />
        </div>

        <div style={{marginBottom: '10px'}}>
          <label>Phone (optional):</label><br/>
          <input 
            type="tel" 
            value={playerData.phone}
            onChange={(e) => setPlayerData({...playerData, phone: e.target.value})}
            style={{width: '100%', padding: '8px'}}
          />
        </div>

        <div style={{marginBottom: '10px'}}>
          <label>Position(s):</label><br/>
          <input 
            type="text" 
            value={playerData.positions}
            onChange={(e) => setPlayerData({...playerData, positions: e.target.value})}
            placeholder="e.g. Forward, Back, Hooker"
            style={{width: '100%', padding: '8px'}}
          />
        </div>

        <h2>Match Availability</h2>
        
        <div style={{marginBottom: '10px'}}>
          <label>Select Match:</label><br/>
          <select 
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            required
            style={{width: '100%', padding: '8px'}}
          >
            <option value="">Choose a match...</option>
            {matches.map(match => (
              <option key={match.id} value={match.id}>
                vs {match.opponent} on {match.date} at {match.time}
              </option>
            ))}
          </select>
        </div>

        <div style={{marginBottom: '10px'}}>
          <label>Availability:</label><br/>
          <select 
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            style={{width: '100%', padding: '8px'}}
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="maybe">Maybe</option>
          </select>
        </div>

        <div style={{marginBottom: '10px'}}>
          <label>Notes (optional):</label><br/>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional comments..."
            style={{width: '100%', padding: '8px', height: '80px'}}
          />
        </div>

        <button type="submit" style={{
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '12px 24px', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}>
          Submit Availability
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
