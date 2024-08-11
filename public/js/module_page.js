translateBtn = document.getElementById("translateBtn");
let isLangToCode = true;

document.getElementById("switchBtn").addEventListener("click", function () {
  isLangToCode = !isLangToCode;
  document.getElementById("phraseInput").placeholder = isLangToCode
    ? "Entrez votre TEXT ..."
    : "Entrez votre CODE SECRET ...";
  document.getElementById("result").placeholder = isLangToCode
    ? "Traduction vers le CODE SECRET ..."
    : "Traduction vers TEXT ...";

  if (isLangToCode) {
    translateBtn.setAttribute("onclick", "ajouterPhrase()");
  } else {
    translateBtn.setAttribute("onclick", "traduirePhrase()");
  }
});

document.getElementById("result").addEventListener("click", function () {
  // Créer une zone de texte temporaire
  const textarea = document.createElement("textarea");
  textarea.value = this.textContent; // Récupérer le texte de la div
  
  if (textarea.value !== ""){
    document.body.appendChild(textarea);
    
    // Sélectionner le texte dans la zone de texte
    textarea.select();
    textarea.setSelectionRange(0, 99999); // Pour les mobiles
    
    // Copier le texte
    document.execCommand("copy");
    
    // Supprimer la zone de texte temporaire
    document.body.removeChild(textarea);
    
    const message = "Texte copié dans le presse-papier !";
    console.log(message);
    notif(message);
  }else{
    const message = "Rien n'a copier ici ...";
    console.log(message);
    notif(message);
  }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      if (translateBtn) {
        translateBtn.click();
      }
    }
});


function notif(message) {
    const notif = document.createElement('div');
    const notifTxt = document.createElement('strong');
    notif.classList.add('notif');
    notifTxt.innerHTML = message;

    notif.appendChild(notifTxt);
    document.body.appendChild(notif);

    setTimeout(() => {
        document.body.removeChild(notif);
    }, 2000);
}
