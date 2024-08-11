const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware pour servir les fichiers statiques (HTML, CSS, JS) du dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route pour obtenir le fichier JSON
app.get('/bdd.json', (req, res) => {
    fs.readFile(path.join(__dirname, 'bdd.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture de bdd.json:', err);
            res.status(500).send('Erreur serveur');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Route pour mettre à jour le fichier JSON
app.post('/bdd.json', express.json(), (req, res) => {
    fs.writeFile(path.join(__dirname, 'bdd.json'), JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture de bdd.json:', err);
            res.status(500).send('Erreur serveur lors de l\'écriture');
            return;
        }
        res.status(200).send('Mise à jour réussie');
    });
});

// Lancer le serveur sur le port spécifié
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
