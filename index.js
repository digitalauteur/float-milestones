const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const SLACK_SIGNING_SECRET = 'your-slack-signing-secret'; // Replace with your Slack signing secret
const FLOAT_API_KEY = 'your-float-api-key'; // Replace with your Float API key

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Endpoint to handle the /milestones slash command
app.post('/milestones', async (req, res) => {
  try {
    // Fetch milestones from the Float API
    const response = await axios.get('https://api.float.com/v3/milestones', {
      headers: {
        'Authorization': `Bearer ${FLOAT_API_KEY}`
      }
    });

    const milestones = response.data;

    if (milestones.length === 0) {
      return res.status(200).send('No milestones found.');
    }

    // Format the milestones into a message
    const milestoneMessages = milestones.map(milestone => {
      return `*${milestone.name}* (Due: ${milestone.due_date})`;
    }).join('\n');

    // Respond to Slack
    res.status(200).send(milestoneMessages);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).send('Error fetching milestones. Please try again later.');
  }
});

app.listen(port, () => {
  console.log(`Slack bot is listening on port ${port}`);
});
