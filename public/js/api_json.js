const apiUrl = "/"; // Ce n'est plus nécessaire

// Fonction pour supprimer une phrase de MongoDB
async function supprimerPhrase(identifiant) {
  try {
    const response = await fetch(`/supprimer/${identifiant}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de la phrase");
    }
    console.log(`Phrase avec le code ${identifiant} supprimée`);
  } catch (error) {
    console.error("Erreur lors de la suppression de la phrase:", error);
  }
}


// Fonction pour traduire une phrase ou plusieurs phrases
async function traduirePhrase() {
  const inputText = document.getElementById("phraseInput").value.trim();
  if (!inputText) {
    message = "Veuillez entrer un code secret.";
    notif(message);
    return;
  }

  const identifiants = inputText.split(/\s+/); // Séparer les codes par des espaces
  const traductions = [];

  // Traiter chaque code secret
  for (const identifiant of identifiants) {
    try {
      const response = await fetch(`/traduire/${identifiant}`);
      const phrase = await response.text();

      if (phrase !== "Phrase non trouvée") {
        traductions.push(phrase);
        // Supprimer la phrase de la base de données après traduction
        await supprimerPhrase(identifiant);
      } else {
        traductions.push(phrase);
      }
    } catch (error) {
      console.error("Erreur lors de la traduction de la phrase:", error);
    }
  }

  // Afficher les traductions séparées par des espaces
  document.getElementById("result").innerText = traductions.join(" ");

  // Effacer l'input après la traduction
  document.getElementById("phraseInput").value = "";
}

// Fonction pour ajouter une nouvelle phrase à MongoDB
async function ajouterPhrase() {
  const phrase = document.getElementById("phraseInput").value.trim();
  if (!phrase) {
    message = "Veuillez entrer une phrase.";
    notif(message);
    return;
  }

  const codeSecret = genererCodeSecret(phrase.length);
  const codeChiffre = chiffrer(codeSecret);

  try {
    const response = await fetch('/ajouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: codeChiffre, phrase }),
    });
    if (response.ok) {
      document.getElementById("result").innerText = `${codeChiffre}`;
    } else {
      throw new Error("Erreur lors de l'ajout de la phrase");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la phrase:", error);
  }

  // Effacer l'input après l'ajout
  document.getElementById("phraseInput").value = "";
}

// Fonction pour générer un code secret
function genererCodeSecret(taillePhrase) {
  let longueurCode = Math.max(4, Math.ceil(taillePhrase / 5));
  let code = "";
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  for (let i = 0; i < longueurCode; i++) {
    code += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return code;
}

// Fonction pour chiffrer une phrase
function chiffrer(texte) {
  const cle = {
    A: "Z",
    B: "Y",
    C: "X",
    D: "W",
    E: "V",
    F: "U",
    G: "T",
    H: "S",
    I: "R",
    J: "Q",
    K: "P",
    L: "O",
    M: "N",
    N: "M",
    O: "L",
    P: "K",
    Q: "J",
    R: "I",
    S: "H",
    T: "G",
    U: "F",
    V: "E",
    W: "D",
    X: "C",
    Y: "B",
    Z: "A",
    "1": "9",
    "2": "8",
    "3": "7",
    "4": "6",
    "5": "0",
    "6": "4",
    "7": "3",
    "8": "2",
    "9": "1",
    "0": "5",
  };
  return texte
    .split("")
    .map((c) => cle[c.toUpperCase()] || c)
    .join("");
}