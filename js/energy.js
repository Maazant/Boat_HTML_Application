const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');
            options.forEach(option => {
                option.classList.remove('active');
            });
            option.classList.add('active');
            const titre_page = document.querySelector('h3');
            load_img_graph(titre_page,option.innerText);
        });
    });
});

// code if else pour avoir un code propre et automatisé sans avoir besoin
// de télécharger chaque images pour chaque équipement différent
function load_img_graph(titre_graph,time_period="6h")
{
    if(titre_graph.innerText == "Hydrogenerateur"){
        var id_graph = document.getElementById("graphique");
        id_graph.src = "../img/graphs/"+titre_graph.innerText.replace(/ /g,'')+"_"+time_period+".jpg";
    }
    else {
        var id_graph = document.getElementById("graphique");
        id_graph.src = "../img/graphs/everything_else.jpg";
    }
}

//pour passer en paramètre l'équipement choisi depuis la page principale
function processUser()
{
    var parameter = location.search.substring(1);
    if(parameter != ""){ //s'il y a un paramètre passé dans l'url
        const titre_page = document.getElementById("titre_page");
        titre_page.innerText=parameter.replace(/_/g,' '); //on remplace le titre du graph avec le paramètre passé dans l'url
        load_img_graph(titre_page); //on charge le graph correspondant au paramètre choisi
        parameter = "";
    }              
}

// code pour choisir un élément différent dans le menu de gauche
const left_menu_texts = document.querySelectorAll("#left_menu_title li");
left_menu_texts.forEach(left_menu_text => {
    //charger la page avec le contenu spécifique de l'équipement choisi sur la page principale
    processUser();
    
    //event listener pour actualiser la page si on clique sur un élément du menu de guache
    left_menu_text.addEventListener('click', () => {
        load_img_graph(left_menu_text);

        const titre_page = document.getElementById("titre_page");
        titre_page.innerText=left_menu_text.innerText;
    });
});


/*****************function get_date********************************
 *  to return the current date in france : dd/mm/yyyy hours/min/sec
 * ****************************************************************/

//execute tache dans un certains nb de temps
setInterval(()=>{
    var date = new Date();
    // var full_date =  date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var hours = date.getHours() + ":" + minutes;
    var text = document.getElementById("time");
    text.innerHTML = hours;
}, 1000);
