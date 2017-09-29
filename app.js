// Initialize Firebase
var config = {
apiKey: "AIzaSyBgKffWjX13sdUpI6vCfmwzLJxJB7hzL5c",
authDomain: "train-scheduler-6b6fd.firebaseapp.com",
databaseURL: "https://train-scheduler-6b6fd.firebaseio.com",
projectId: "train-scheduler-6b6fd",
storageBucket: "train-scheduler-6b6fd.appspot.com",
messagingSenderId: "670044619295"
};
firebase.initializeApp(config);

var name;
var destination; 
var firstTrainTime;
var frequency;
var database = firebase.database();


firstTrainTime = moment("06:00", "HH:mm");
var currentTime = moment().format("HH:mm"); //format it 
currentTime = moment("07:45", "HH:mm"); // make it a moment object 
console.log(currentTime);
console.log(firstTrainTime);

var minutesWaited = currentTime.diff(firstTrainTime, "minutes")%25;

var minutesRemaining = frequency - minutesWaited; 





database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	//calculate  total billed and months worked - use moment.js 
	firstTrainTime = moment(childSnapshot.val().firstTrainTime, "HH:mm");
	var currentTime = moment().format("HH:mm"); //format it 
	currentTime = moment(currentTime, "HH:mm"); // make it a moment object 



	//then we need to display information on the html 
	var row = $("<tr>");
	var cell_1 = $("<td>");
	var cell_2 = $("<td>");
	var cell_3 = $("<td>");
	var cell_4 = $("<td>");
	var cell_5 = $("<td>");

	//Add the column values.
	cell_1.text(childSnapshot.val().name);
	cell_2.text(childSnapshot.val().destination);
	cell_3.text(childSnapshot.val().frequency);
	cell_4.text();
	cell_5.text();

	row.append(cell_1);
	row.append(cell_2);
	row.append(cell_3);
	row.append(cell_4);
	row.append(cell_5);

	// ID of the table goes here.
	$("#employee-table").append(row);


},function(errorObject){
  console.log("The read failed:" + errorObject.code);
});




// on click do onSubmit()
$("#submit").on("click", function(event){

	//nice to have - check if any fields are empty and dont let them submit if there is. 

	event.preventDefault();

	//get the value in each of the text boxes 
	name = $("#train-name").val().trim();
	destination = $("#destination").val().trim();
	firstTrainTime = $("#first-train-time").val().trim();
	frequency = $("#frequency").val().trim();

	// push to database 
	database.ref().push({
        "name": name,
        "destination": destination,
        "firstTrainTime": firstTrainTime,
        "frequency": frequency,
        "dateAdded": firebase.database.ServerValue.TIMESTAMP

     });

	// empty the fields 
	$("#train-name").val();
	$("#destination").val();
	$("#first-train-time").val();
	$("#frequency").val();



}); 