
// --------- Time function ---------
setInterval(() => {
    var date = new Date();
    // var full_date =  date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var hours = date.getHours() + ":" + minutes;
    var text = document.getElementById("time");
    text.innerHTML = hours;
    console.log(text.innerHTML);
}, 1000);


var fleche = document.getElementById('open_table');
let dashboard = document.getElementById("dashboard");

function opendashboard(){
  if (fleche!=''){
    if (fleche.checked){
        dashboard.style.display = "none";
    }
    else{
        dashboard.style.display = "block";
    }
  }
}