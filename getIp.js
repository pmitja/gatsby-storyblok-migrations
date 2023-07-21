import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.get('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const response = await fetch(`https://api.ipapi.com/${ip}?access_key=YOUR_ACCESS_KEY`);
    const data = await response.json();
    
    console.log('User IP:', ip);
    console.log('Country Code:', data.country_code);

    if (data.country_code === 'SI') {
      console.log('Redirecting to the language version for your country');
      // Redirect the user to the language version for your country
      res.redirect('/your-language-version');
    } else {
      console.log('Serving the English version');
      // Continue serving the English version
      // ...
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle any errors that occur during the API request
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
