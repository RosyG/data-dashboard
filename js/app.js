// Puedes hacer uso de la base de datos a través de la variable `data`
console.log(data);
var selection=document.getElementById("selection");//Por medio de DOM guardo en una variable las opciones de la sede-generación que puede seleccionar del user.
selection.addEventListener("change", generationSelection);//Creando el evento cambio, para detectar lo que el user selecciona.

function generationSelection(event) {

  var selectIndex = event.target.selectedIndex;//Me arroja el indice empezando en 0 y hasta 10
  //selectIndex es un comando de JS que me devuelve el indice del elemento que detoma el evento.
  var option = event.target[selectIndex];//Se muestra el tag option que fue seleccionado, sirve para saber que cambio u option es el que se esta seleccionando.
  var location = option.dataset.sede;//Accediendo al data-sede del tag option, puede ser AQP, CDMX, LIM o SCL.
  var generation = option.dataset.generacion;//Accediendo a la data-generacion del tag option, puede ser 2016-2, 2017-1 o 2017-2 (depende de la sede).
  //Hasta aquí se tienen como variables a la sede y generación y un dato fijo es students
  var students = data[location][generation]["students"];// las variables (location y generation) varian de acuerdo a los cambios que el user realiza cuando elige una opción.
  //La variable students me va a mostrar el número de los contenidos que tiene la key students de una location y generation seleccionada, students es un ARRAY de objects, entonces sus values se muestran como objetos.
  var ratings= data[location][generation]["ratings"];//Variable que contiene las calificaciones por sprint de los teachers, jedi y el NPS.
  //console.log(students);

//***Variables de los puntos en el LMS****
  var numberStudents= students.length + " " + location + " " + generation;//Número de estudiantes por sede y generación que elige el TM ver.
  //console.log(numberStudents);

  //Función que muestra el % de deserción
  desertion (students);

  //Función que muestra # de estudiantes que supera el 70% en TECH y HSE.
  exceedsGoal (students);

  //Función del NPS, promedio de los sprints cursados.
  NetPromoterScore (ratings);

  //Función del porcentaje de estudiantes satisfechas con la experiencia en Laboratoria.
  satisfiedStudents (ratings);

  //Función del promedio de lxs profesores.
  averageTeachers (ratings);

  //Función del promedio de lxs jedi masters.
  averageJedi (ratings);

}//Fin evento change.


function averageTeachers (allRatings) {
  var averageTeacher = 0;//Variable que guardará el promedio de la calificación a los Teachers.
  for (var i = 0; i < allRatings.length; i++) {
    var ratingsTeacher = allRatings[i]["teacher"];//Accediendo a la calificación de un sprint.
    averageTeacher = ratingsTeacher + averageTeacher;//Suma de la calificación a lxs Teachers en cada sprint.
  }
  averageTeacher = parseInt((averageTeacher / allRatings.length).toFixed(2));
  //console.log(averageTeacher);//Muestra el promedio de la calificación de los Teaches en todos los sprints.

  //Gráfica de las puntuaciones de los teachers en promedio.
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawCharTeacher);
function drawCharTeacher() {
  var data = google.visualization.arrayToDataTable([
    ['Teacher', 'PromedioTeacher', { role: 'style' }],
    ['Teacher', averageTeacher, 'stroke-color: #871B47; stroke-opacity: 0.6; stroke-width: 8; fill-color: #BC5679; fill-opacity: 0.2']

  ]);

  var options = {
      title: 'Puntuación promedio de l@s profesores',
  }
  var chart = new google.visualization.ColumnChart(document.getElementById("teacher"));
  chart.draw(data, options);
}//Fin de la función drawCharTeacher.

}//Fin de la función averageTeachers ().

function averageJedi (allRatings) {
    var averageJedi = 0;//Variable que guardará el promedio de la calificación a los Jedi Master.
    for (var i = 0; i < allRatings.length; i++) {
      var ratingsJedi = allRatings[i]["jedi"];//Accediendo a la calificación de un sprint.
      averageJedi = (ratingsJedi + averageJedi);//Suma de la calificación a lxs Jedi Master en cada sprint.
    }
    averageJedi = parseInt((averageJedi / allRatings.length).toFixed(2));
    //console.log(averageJedi);//Muestra el promedio de la calificación de los Jedi Master en todos los sprints.

    //Gráfica de las puntuaciones de los Jedi en promedio.
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChartJedi);
    function drawChartJedi() {
      var data = google.visualization.arrayToDataTable([
        ['Jedi', 'PromedioJedi', { role: 'style' }],
        ['Jedi', averageJedi, 'stroke-color: #459A81; stroke-opacity: 0.6; stroke-width: 8; fill-color: #BC5679; fill-opacity: 0.2']
        ]);

        var options = {
          title: 'Puntuación promedio de l@s profesores',
        }
        var chart = new google.visualization.ColumnChart(document.getElementById("jedi"));
        chart.draw(data, options);
    }//Fin de la función drawCharJedi.

}//Fin de la función averageJedi ().



function satisfiedStudents (allRatings) {

  var percentageUnsatisfied = 0;
  for (var i = 0; i < allRatings.length; i++) {
    var unsatisfied = allRatings[i]["student"]["no-cumple"];//Porcentaje de estudiantes NO satisfechas.
    percentageUnsatisfied = percentageUnsatisfied + unsatisfied;//Suma de la insatisfacción en cada SPRINT.
  }
  percentageUnsatisfied = (percentageUnsatisfied / allRatings.length).toFixed(2)
  var percentageSatisfied = 100 - percentageUnsatisfied ; //Porcentaje de la satisfacción promedio en cada SPRINT
  //console.log(percentageSatisfied);//Muestra el porcentaje de SATISFACIÓN en promedio de todos los SPRINTS cursados.

  //Gráfica de la satisfación de las estudiantes.
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChartSatisfiedGeneral);
  function drawChartSatisfiedGeneral() {
    var data = google.visualization.arrayToDataTable([
      ['aprobación', 'promedio por sprint'],
      ['Satisfechas', percentageSatisfied],
      ['Insatisfechas', parseInt(percentageUnsatisfied)],
    ]);
    var options = {
      title: 'Porcentaje General de las estudiantes satisfechas por su experiencia en Laboratoria',
      pieHole: 0.4,
      slices: {
       0: { color: '#27d5db' },
       1: { color: '#1835a5' }
      }
   }

    var chart = new google.visualization.PieChart(document.getElementById('satisfied'));
    chart.draw(data, options);
  } //Fin de la función drawChartSatisfiedGeneral.
}//Fin de la función satisfiedStudents ().


function NetPromoterScore (allRatings) {
  var totalAnswers = allRatings.length; //Total de respuestas.
  var averagePromoters = 0;
  var averagePassive = 0;
  var averageDetractors = 0;

  for (var i = 0; i < allRatings.length; i++) {
      var answerPromoter = allRatings[i]["nps"]["promoters"];//Valores de las respuestas en Promoters, son entre 0%-100%.
      averagePromoters = (answerPromoter + averagePromoters);
      var answerPassive = allRatings[i]["nps"]["passive"];//Valores de las respuestas en Passive.
      averagePassive = (answerPassive + averagePassive);
      var answerDetractors = allRatings[i]["nps"]["detractors"];//Valores de las respuestas en Detractors.
      averageDetractors = (answerDetractors + averageDetractors);
  }
  averagePromoters = averagePromoters / totalAnswers;
  averagePassive = averagePassive / totalAnswers;
  averageDetractors = averageDetractors / totalAnswers;
  var nps = averagePromoters - averageDetractors; //Valor del NPS= [Promoters] - [Detractors].
  /* Esto no es valido hacerlo, porque el la DATA ya nos proporciona un promedio de promoter, passive y detractor en cada sprint.
    [Promoters] = [Respuestas 9 o 10] / [Total respuestas] * 100
  */
}//Fin de la función NetPromoterScore.



function exceedsGoal(allTheStudents) {
  var maxTech = 1800;//puntos máximos de TECH.
  var maxHse = 1200;//puntos máximos de HSE.
  var pointsTecH = [];
  var pointsHse = [];
  var sprint = [];
  var allPointsTech = 0;
  var allPointsHse = 0;
  var approvedStudent = 0;
  var approvedTech = 0;
  var approvedHse = 0;

  for (var i = 0; i < allTheStudents.length; i ++) {
    sprint = allTheStudents[i]["sprints"];//Iteración del sprint de una alumna
    console.log(allTheStudents[i]["name"]);//Muestra el nombre de la estudiante.

    for (var j = 0; j < sprint.length; j ++) {
      pointsTecH = sprint[j]["score"]["tech"];//Iteración de los puntos en Tech en cada sprint cursado.
      allPointsTech = pointsTecH + allPointsTech;//Suma de todos los puntos Tech por una alumna.
      pointsHse = sprint[j]["score"]["hse"];//Iteración de los puntos en HSE en cada sprint cursado.
      allPointsHse = pointsHse + allPointsHse;//Suma de todos los puntos HSE por una alumna.
    }
    var maxPointsTech = maxTech * sprint.length;//Se multiplica a los puntos máximos que se alcanza en un sprint y se multiplica por el # de sprint del que se tiene evaluación de puntos TECH.
    var averageTech = ((allPointsTech/maxPointsTech)*100).toFixed(2);//promedio de todos los sprints en una alumna.
    var maxPointsHse = maxHse* sprint.length;//Se multiplica a los puntos máximos que se alcanza en un sprint y se multiplica por el # de sprint del que se tiene evaluación de puntos HSE.
    var averageHse = ((allPointsHse/maxPointsHse)*100).toFixed(2);//promedio de todos los sprints en una alumna.
    allPointsTech = 0;//Se limpia la variable para que no se acumule la suma de los puntos TECH de las alumnas anteriores.
    allPointsHse = 0;//Se limpia la variable para que no se acumule la suma de los puntos HSE de las alumnas anteriores.

    if (averageTech>=70 && averageHse>=70) {
      //console.log("estudiante aprobada");
      approvedStudent = approvedStudent + 1;//# de alumnas que superan el 70% en ambos TECH Y HSE.
    } if (averageTech >= 70) {
        approvedTech = approvedTech + 1; //# de alumnas que supera el 70% en TECH.
    } if (averageHse >= 70) {
        approvedHse = approvedHse + 1;//# de alumnas que supera el 70% en HSE.
    }
    //console.log(approvedStudent);//Cantidad de estudiantes que supera la meta.
    var totalStudents = parseInt(allTheStudents.length);
    console.log(totalStudents + "total de estudiantes");//Cantidad de estudiantes en la sede y generación.
  }

  var percentageApproved = parseInt(((approvedStudent / allTheStudents.length) * 100).toFixed(2));//Procentaje que reprenta en comparación al total de estudiantes.
  var percentageApprovedTech = parseInt(((approvedTech / allTheStudents.length) * 100).toFixed(2));//Porcentaje de alumnas que supera el mínimo solo en TECH.
  var percentageApprovedHse = parseInt(((approvedHse / allTheStudents.length) * 100).toFixed(2));//Porcentaje de alumnas que supera el mínimo solo en HSE.
  var disapproved = (100 - percentageApproved).toFixed(2);
/*
    console.log("tech"+ percentageApprovedTech + "%");
    console.log("hse" + percentageApprovedHse + "%");
    console.log("ambos"+percentageApproved + "%");//Muestra el Procentaje de alumnas que aprobaron el 70% en HSE Y TECH.
    console.log("ambos"+disapproved + "%");//Muestra el porcentaje de alumans que NO aprobaron el 70% en HSE y TECH.
*/
  //Gráfica de las chicas que superan el %70 en promedio por sprint.
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChartTech);
  google.charts.setOnLoadCallback(drawChartHse);
  function drawChartTech() {
    var data = google.visualization.arrayToDataTable([
      ['tech', 'promedio por sprint'],
      ['Mayor al 70%', percentageApprovedTech],
      ['Menor al 70%', totalStudents],
    ]);
    var options = {
      title: 'Porcentaje General de las estudiantes calificación mayor al 70% en TECH',
      pieHole: 0.4,
      slices: {
       0: { color: '#dfe20f' },
       1: { color: '#e0e24a' }
      }
    };
    var chart = new google.visualization.PieChart(document.getElementById('tech'));
    chart.draw(data, options);
  } //Fin de la función drawChartTech.


  function drawChartHse() {
    var data = google.visualization.arrayToDataTable([
      ['hse', 'promedio por sprint'],
      ['Mayor al 70%', percentageApprovedHse],
      ['Menor al 70%', totalStudents],
      ]);
    var options = {
      title: 'Porcentaje General de las estudiantes calificación mayor al 70% en HSE',
      pieHole: 0.4,
      slices: {
       0: { color: '#046b03' },
       1: { color: '#48ce46' }
      }
    };
    var chart = new google.visualization.PieChart(document.getElementById('hse'));
    chart.draw(data, options);
  } //Fin de la función drawChartHse.

}//Fin de exceedsGoal ()



function desertion (allTheStudents) {

  var nameStudent = [];//El arreglo contiene true o false si es que cada alumna está activa o no.
  var notActive = 0;
    for (i = 0; i < allTheStudents.length; i ++) {
      // Este for sirve para ir viendo si esta activa alumna por alumna.
      nameStudent = allTheStudents[i]["active"];
      if (nameStudent === false) {//Si es falso, es decir que la alumna no esta activa, entonces se incrementa la variable notActive.
        notActive= notActive+1;
      }
    }
  var percentageDesertion =((notActive/allTheStudents.length)*100).toFixed(2); //Al número del porcentaje es necesario redondearlo a dos cifras, es por eso que uso el método .toFixed().
  var percentageActive = 100 - percentageDesertion;

  //Gráfica de la deserción de estudiantes
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChartDesertionGeneral);
  function drawChartDesertionGeneral() {
    var data = google.visualization.arrayToDataTable([
      ['estado de las estudiantes', 'promedio por sprint'],
      ['Activas', percentageActive],
      ['Deserción', parseInt(percentageDesertion)],
      ]);

    var options = {
      title: 'Porcentaje General de la deserción en Laboratoria',
      pieHole: 0.4,
      slices: {
       0: { color: '#d827d5' },
       1: { color: '#84157f' }
      }
    };

    var chart = new google.visualization.PieChart(document.getElementById('desertion'));
    chart.draw(data, options);
  } //Fin de la función drawChartDesertionGeneral.

}//Fin de desertion ()
