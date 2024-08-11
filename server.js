const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

const phraseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  phrase: { type: String, required: true }
});

const Phrase = mongoose.model('Phrase', phraseSchema);

app.use(bodyParser.json());

app.post('/ajouter', async (req, res) => {
  const { code, phrase } = req.body;
  try {
    await Phrase.create({ code, phrase });
    res.send('Phrase ajoutée');
  } catch (error) {
    res.status(500).send('Erreur lors de l\'ajout de la phrase');
  }
});

app.get('/traduire/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const phrase = await Phrase.findOne({ code });
    res.send(phrase ? phrase.phrase : 'Phrase non trouvée');
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération de la phrase');
  }
});

app.delete('/supprimer/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await Phrase.findOneAndDelete({ code });
    if (result) {
      res.send('Phrase supprimée');
    } else {
      res.status(404).send('Phrase non trouvée');
    }
  } catch (error) {
    res.status(500).send('Erreur lors de la suppression de la phrase');
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));
