const apiUrl = "bdd.json";

// Fonction pour charger la base de données
async function fetchBDD() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement du fichier JSON");
    }
    const data = await response.json();
    console.log("Contenu du JSON chargé :", data);
    return data;
  } catch (error) {
    console.error("Erreur dans fetchBDD:", error);
    return {};
  }
}

// Fonction pour supprimer une phrase du JSON
async function supprimerPhrase(identifiant) {
  try {
    let baseDeDonnees = await fetchBDD();

    // Supprimer l'entrée correspondant à l'identifiant
    delete baseDeDonnees[identifiant];

    // Envoyer la base de données mise à jour
    await envoyerBDD(baseDeDonnees);
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
  const baseDeDonnees = await fetchBDD();

  const traductions = [];

  // Fonction récursive pour trouver la traduction finale
  function obtenirPhrase(identifiant) {
    if (baseDeDonnees[identifiant]) {
      const valeur = baseDeDonnees[identifiant];
      if (baseDeDonnees[valeur]) {
        return obtenirPhrase(valeur);
      } else {
        return valeur;
      }
    } else {
      return null;
    }
  }

  // Traiter chaque code secret
  for (const identifiant of identifiants) {
    const phrase = obtenirPhrase(identifiant);
    if (phrase) {
      traductions.push(phrase);
      // Supprimer la phrase du fichier JSON après traduction
      await supprimerPhrase(identifiant);
    } else {
      traductions.push("Phrase non trouvée");
    }
  }

  // Afficher les traductions séparées par des espaces
  document.getElementById("result").innerText = traductions.join(" ");

  // Effacer l'input après la traduction
  document.getElementById("phraseInput").value = "";
}

// Fonction pour ajouter une nouvelle phrase
async function ajouterPhrase() {
  const phrase = document.getElementById("phraseInput").value.trim();
  if (!phrase) {
    message = "Veuillez entrer une phrase.";
    notif(message);
    return;
  }

  let baseDeDonnees = await fetchBDD();
  const codeSecret = genererCodeSecret(phrase.length);
  const codeChiffre = chiffrer(codeSecret);
  baseDeDonnees[codeChiffre] = phrase;

  await envoyerBDD(baseDeDonnees);
  document.getElementById("result").innerText = `${codeChiffre}`;

  // Effacer l'input après l'ajout
  document.getElementById("phraseInput").value = "";
}

// Fonction pour envoyer la base de données mise à jour au serveur
async function envoyerBDD(baseDeDonnees) {
  try {
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(baseDeDonnees),
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des données:", error);
  }
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