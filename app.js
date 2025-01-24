const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Rutas
app.get('/', (req, res) => {
  res.render('pages/home', { title: 'Home' });
});

app.get('/create/:action?', async (req, res) => {
  const action = req.params.action;

  if (action === 'generate') {
    try {
      // Hacer una solicitud a la API de Waifu.pics
      const response = await axios.get('https://api.waifu.pics/sfw/waifu');

      // Extraer los datos de la respuesta
      const waifu = response.data;
      res.json({
        name: 'Waifu aleatoria', 
        image: waifu.url,
        description: '¡Una waifu aleatoria para ti!',
      });
    } catch (error) {
      console.error('Error en el servidor:', error.message);
      res.status(500).json({ error: 'Error al generar waifu' });
    }
  } else {
    res.render('pages/create', { title: 'Create' });
  }
});

app.use((req, res) => {
  res.status(404).render('errors/404', { title: '404' });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});