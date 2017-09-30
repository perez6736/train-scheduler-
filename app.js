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

// calculate minutes remaining
// returns an integer 
// needs firebase child snapshot as a param --- is this good practice? 
function calculateMinutesRemaining(childSnapshot){
	//calculate  total billed and months worked - use moment.js 
	firstTrainTime = moment(childSnapshot.val().firstTrainTime, "HH:mm");
	var currentTime = moment().format("HH:mm"); //format it 
	currentTime = moment(currentTime, "HH:mm"); // make it a moment object 
	frequency = childSnapshot.val().frequency;
	var minutesRemaining;
	var minutesWaited = currentTime.diff(firstTrainTime, "minutes")%frequency;
	var minutesRemaining; 

	if(minutesWaited<0){
		minutesWaited = Math.abs(minutesWaited);
		minutesRemaining = frequency - minutesWaited;
		return minutesRemaining; 
	}
	else{
		minutesRemaining = frequency - minutesWaited; 
		return minutesRemaining;
	}
}

function calculateNextTrainTime(childSnapshot){
	var currentTime = moment().format("HH:mm"); //format it 
	currentTime = moment(currentTime, "HH:mm"); // make it a moment object 
	var minutesRemaining = calculateMinutesRemaining(childSnapshot);

	var NextTrainTime = currentTime.add(minutesRemaining, "m");

	return NextTrainTime.format("HH:mm");
}


database.ref().on("child_added", function(childSnapshot, prevChildKey) {

	//create a column for 
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
	cell_4.text(calculateMinutesRemaining(childSnapshot));
	cell_5.text(calculateNextTrainTime(childSnapshot));

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
	$("#train-name").val("");
	$("#destination").val("");
	$("#first-train-time").val("");
	$("#frequency").val("");

}); 