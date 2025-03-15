const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); // Add CORS support
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Discord Webhook URL (Replace with your actual webhook URL)
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1350251017496957109/bEn6cyL5yKvJyo774dCTyIxG599UXWqDxAKT5M2VY4qgjN6aCTvr0Ap5h2cWp1Lq5gYb';

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// Embed Builder Function
function buildEmbed(teamName, player1, player2, player3) {
  return {
    title: '🎮 **New Team Registration** 🎮',
    description: 'A new team has registered for the tournament!',
    color: 0xFFA500, // Orange color
    fields: [
      { name: '> **Team Name**', value: teamName, inline: false },
      { name: '> **Player 1**', value: player1, inline: false },
      { name: '> **Player 2**', value: player2, inline: false },
      { name: '> **Player 3**', value: player3, inline: false },
    ],
    image: {
      url: 'https://i.imgur.com/c0io11d.jpg', // Tournament image
    },
    footer: {
      text: 'Big Tipper Tourneys',
      icon_url: 'https://i.imgur.com/ugKGUQA.png', // Footer icon
    },
    timestamp: new Date().toISOString(), // Add timestamp
  };
}

// POST endpoint to handle team registration
app.post('/register', async (req, res) => {
  const { teamName, player1, player2, player3 } = req.body;

  // Validate required fields
  if (!teamName || !player1 || !player2 || !player3) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  console.log('Received registration request:', { teamName, player1, player2, player3 });

  try {
    // Build the embed using the buildEmbed function
    const discordEmbed = buildEmbed(teamName, player1, player2, player3);

    // Send a Discord webhook notification
    const response = await axios.post(DISCORD_WEBHOOK_URL, {
      embeds: [discordEmbed],
    });

    console.log('Discord webhook response:', response.data);
    res.status(200).json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    console.error('❌ Error sending Discord webhook:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: 'Failed to send registration notification.' });
  }
});

// Serve static files (for frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
