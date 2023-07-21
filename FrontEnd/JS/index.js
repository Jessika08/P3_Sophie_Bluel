// recupération token
const token = window.sessionStorage.getItem("token");


// affichage du contenu selon le statut de connexion
let hiddenElements = document.querySelectorAll(".modifier");

// si le token est null, les fonctions admin (boutons et liens) n'apparaissent pas 
if (token !== null) {
  document.getElementById('login-button').style.display = 'none';
  document.getElementById('logout-button').style.display = 'inline';
  hiddenElements.forEach(hiddenElements => hiddenElements.style.display = "inline");
  document.querySelector(".edition-mode").style.display = "flex";

  // si le token est bon, les fonctions du mode admin (boutons et liens) sont disponible
} else {
  document.getElementById('logout-button').style.display = 'none';
  document.getElementById('login-button').style.display = 'inline';
  hiddenElements.forEach(hiddenElements => hiddenElements.style.display = "none");
  document.querySelector(".edition-mode").style.display = "none";

}

//suppression du token à la déconnexion
document.getElementById("logout-button").addEventListener("click", async function() {
  window.sessionStorage.removeItem("token");
})


/*-----------Récupérer dynamiquement les données des travaux via l’API------------------------------*/
let projets = [];

fetch('http://localhost:5678/api/works')//ici je récupère le fichier json dans localhost(base de données)
.then((res) => res.json())

.then(function(jsonWorks) { //ensuite j'appelle la fonction recupererWorks
  recupererWorks(jsonWorks)
  projets = jsonWorks;
})



// message d'erreur s'affiche dans la console si un then ne peux pas s'executer
.catch(function(error) {
    console.log('Il y a eu un problème avec l\'opération fetch : ' + error.message);
  });

//fonction qui sert à recuperer les travaux 
function recupererWorks(works){
    let divGallery=document.querySelector(".gallery")
    console.log(divGallery)
    for (let work of works ) {
    console.log(work)
    afficherWork(work.imageUrl,work.title,work.categoryId,divGallery)//paramètre de la fonction 
   }

} 

function afficherWork(imageUrl,title,categoryId,divGallery){
  //création des balises avec createElement
  const figureElement = document.createElement("figure");// creation de la balise figure qui englobe title et image
  let alternativeText = title;// ici ma variable me sert à eviter le doublons de title et avoir une variable qui correspond à son usage 
  
  const imageElement = document.createElement("img");//création de l'image 
  imageElement.src = imageUrl;//source de l'image
  imageElement.alt = alternativeText;// texte alternatif de l'image 
  
  const titleElement = document.createElement("figcaption");//création du title
  titleElement.innerHTML = title;//contenu du title 
  
  const categoriesElement = document.createElement("id")// création de la balise id
  categoriesElement.innerHTML =categoryId;
  
  console.log(imageUrl,title,categoryId,divGallery);


  //divGallery = document.querySelector(".gallery"); -> ligne facultative car déjà présente en ligne 16 
  divGallery.appendChild(figureElement); // je rattache l'element enfant figurElement au parent divGallery
  figureElement.appendChild(imageElement);
  figureElement.appendChild(titleElement);
  

}

// DOM boutons "modifier" liés aux modales
let overallModal = document.querySelector(".container-modale");
let modal = document.querySelector(".modale");
let modalAjout = document.querySelector(".second-modale");
let openModalAjout = document.querySelector(".btn-modale");

// eventlistener du bouton modifier liés à la première modale
hiddenElements[1].addEventListener("click", function(e) {
  e.preventDefault
      // le changement des styles display permet l'apparition du contenu
  overallModal.style.display = "flex";
  modal.style.display = "flex";
  // le click extérieur ferme la modale
  overallModal.addEventListener('click', closeModal);
  // le click sur la croix ferme la modale
  modal.querySelector(".close-modal").addEventListener('click', closeModal)
  adminGallery(projets)
})

// fonction permettant la fermeture de la modale (utilisée sur le click extérieur et la croix)
const closeModal = function(e) {
  e.preventDefault
      // les styles display passent en none pour masquer la modale
  overallModal.style.display = "none";
  modal.style.display = "none";
  modalAjout.style.display = "none";

   // suppression de la précédente galerie en cas de fermeture et réouverture de la modale sans rafraichir la page
   document.querySelectorAll("div").forEach((element) => {
    if (element.className == "thumbnail") {
        element.remove()
    }
})
document.querySelectorAll("p").forEach((element) => {
    if (element.className == "container-thumbnail") {
        element.remove()
    }
})
document.querySelectorAll("p").forEach((element) => {
    if (element.className == "edit") {
        element.remove()
    }
})
}

// ouverture de la seconde modale depuis la première modale
openModalAjout.addEventListener("click", function(e) {
  e.preventDefault
      // les styles display de la seconde modale passent en flex pour apparaitre 
  overallModal.style.display = "flex";
  modalAjout.style.display = "flex";
  // le style display de la modale actuelle passent en none pour disparaitre 
  modal.style.display = "none";
  // eventlisteners pour la fermeture au click extérieur ou sur la croix
  overallModal.addEventListener('click', closeModal);
  modalAjout.querySelector(".close-modal").addEventListener('click', closeModal)
})


/*----------------------------Ajout du tri des projets par catégorie dans la galerie--------------------------------*/

 //filtre qui affiche tous les projets
 const buttonAll = document.querySelector(".tous");
buttonAll.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    recupererWorks(projets);
});

//filtre "objet"
 const buttonItems = document.querySelector(".objets");
 buttonItems.addEventListener("click", function () {
   const filterItems = projets.filter(p => p.categoryId == 1);
   document.querySelector(".gallery").innerHTML = "";
   recupererWorks(filterItems);
 });
 
//filtre "appartements"
 const buttonAppart = document.querySelector(".appartements");
 buttonAppart.addEventListener("click", function () {
   const filterApparts = projets.filter(p => p.categoryId == 2);
   document.querySelector(".gallery").innerHTML = "";
   recupererWorks(filterApparts);
 });

 //filtre "hôtels et restaurants"
 const buttonHotelRestau = document.querySelector(".hotels-et-restaurants");
 buttonHotelRestau.addEventListener("click", function () {
   const filterHotelAndRestau = projets.filter(p => p.categoryId == 3);
   document.querySelector(".gallery").innerHTML = "";
   recupererWorks(filterHotelAndRestau);
 });

 
//------------------------------------------------

// fetch suppression de travaux
function deleteItem(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
      headers: {
          Authorization: `Bearer ${token}`
      },
      method: "DELETE"
  }).then((value) => {
      console.log(value)
  })
}

// génération de la galerie administrateur (modale)
function adminGallery(projets) {
  for (let i = 0; i < projets.length; i++) {
      const item = projets[i];

      // récupération des éléments DOM
      const sectionItem = document.querySelector(".grid-modal");
      const itemElement = document.createElement("item");

      const imageItem = document.createElement("div");
      imageItem.className = "thumbnail";
      imageItem.style.backgroundImage = "url(../../Backend/images/" + item.imageUrl.split('/')[4] + ")";

      const edit = document.createElement("p");
      edit.className = "edit";
      edit.innerText = "éditer";

      // récupération du bouton corbeille et ajout d'un eventlistener pour la suppression
      const trashBtn = document.createElement("p");
      trashBtn.className = "container-thumbnail";
      trashBtn.innerHTML = `<i class="fa-solid fa-trash fa-xs" id="${item.id}"></i>`;
      trashBtn.id = item.id;
      trashBtn.addEventListener('click', (e) => {
          e.preventDefault()
          var res = confirm("Êtes-vous sûr de vouloir supprimer?");
          if(res){
              deleteItem(e.target.id)
          } 
          console.log(e)
      })

      sectionItem.appendChild(itemElement);
      itemElement.appendChild(imageItem);
      imageItem.appendChild(trashBtn);
      itemElement.appendChild(edit);


  }
}

//----------------------------------------------

// ajout nouveaux travaux

document.getElementById("newValider").addEventListener("click", async function(event) {
  event.preventDefault()

  // récupération des éléments dom liés au formulaire d'ajout de nouveaux travaux
  const newImgElement = document.getElementById('new-img');
  const imageFile = newImgElement.files[0];
  let newTitleElement = document.getElementById("new-title").value
  let newCatElement = document.getElementById("new-category").value

  // condition si tous les champs sont remplis (différent de null ou différent de vide)
  if (newImgElement !== null && newImgElement !== "" && newTitleElement !== null && newTitleElement !== "" && newCatElement !== "0") {

      // création d'un nouvel élément
      const body = new FormData();
      body.append("image", imageFile)
      body.append("title", newTitleElement)
      body.append("category", newCatElement)

      // requête à l'API 
      const request = new XMLHttpRequest();
      const url = 'http://localhost:5678/api/works';
      request.open('POST', url, true);
      request.setRequestHeader('Authorization', 'Bearer ' + `${token}`);
      request.onreadystatechange = function() {
          if (request.readyState === XMLHttpRequest.DONE) {
              // ajout avec succès si la requête est un succès (201)
              if (request.status === 201) {
                  console.log(request.responseText);
                  // affichage d'une erreur si le statut de la requête est différent de 201
              } else {
                  const alert = document.querySelector(".alert");
                  alert.style.display = "inline";
              }
          }
      };
      request.send(body);
      // affichage des erreurs si le formulaire n'est pas bien rempli
  } else {
      const alert = document.querySelector(".secondAlert");
      alert.style.display = "inline";
      if (imageFile === undefined) {
          alert.innerText = "";
          alert.innerText = alert.textContent + "fichier incorrect";
      } else if (newTitleElement == null || newTitleElement == "") {
          alert.innerText = "";
          alert.innerText = alert.textContent + "titre incorrect ";
      } else if (newCatElement == null || newCatElement == 0) {
          alert.innerText = "";
          alert.innerText = alert.textContent + "catégorie incorrect ";
      }
  }
})



