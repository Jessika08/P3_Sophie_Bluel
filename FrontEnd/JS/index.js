/*------------------------page de connexion-----------------------*/

// recupération token
const token = window.sessionStorage.getItem("token");


// affichage du contenu selon le statut de connexion
let hiddenElements = document.querySelectorAll(".admin");

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




.catch(function(error) {// message d'erreur s'affiche dans la console si un then ne peux pas s'executer
    console.log('Il y a eu un problème avec l\'opération fetch : ' + error.message);
  });


function recupererWorks(works){//fonction qui sert à recuperer les travaux 
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



/*On a deja recuperer la categorie ID (voir parametre recupererworks) integrer cet Id dans la figure
 ( ex : une classe ( ne commence pas par un chiffre) ou un parametre rel ou dataset)
 les boutons auront egalement chacun le meme nom de class qui contient l'id de la categories 
 (apparait dans le code mais pas visible sur la page)
 au clique d'un bouton je recupere l'id categorie du bouton et je masque 
 toute les figure qui on un id categorie different (hide , display none)
 le bouton de reinitialisation doit tout afficher (tout les travaux )*/ 


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

 
