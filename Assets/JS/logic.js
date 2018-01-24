// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)

var config = {
    apiKey: "AIzaSyDyzPxbLNXyQmvLYi6FLplG4emOztfgrFI",
    authDomain: "my-first-firebase-projec-dfe85.firebaseapp.com",
    databaseURL: "https://my-first-firebase-projec-dfe85.firebaseio.com",
    projectId: "my-first-firebase-projec-dfe85",
    storageBucket: "my-first-firebase-projec-dfe85.appspot.com",
    messagingSenderId: "1060398737556"
  };
  firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
const dbRef = firebase.database().ref('recentTrainPush');

// Daclare variable for Train Details

var trainName;
var trainDestination;
var trainFirstTime;
var trainFrequency;
var trainNextArrival;
var trainMinAway;

// Add Train on Button click event
$("#add-train").on("click", function(event) {
  
  event.preventDefault();

  // Setting the input value to a variable and then clearing the input
  trainName = $("#Train-name").val().trim();
  $("#Train-name").val("");

  trainDestination = $("#Train-destination").val().trim();
  $("#Train-destination").val("");

  trainFirstTime = moment($("#Train-firstTrainTime").val().trim(), "HH:mm").subtract(10, "years").format("X");
  $("#Train-firstTrainTime").val("");

  trainFrequency = $("#Train-frequency").val().trim();
  $("#Train-frequency").val("");

   // push instead of set (notice the additional property)
    dbRef.push({
        name: trainName,
        destination: trainDestination,
        firstTrainTime: trainFirstTime,
        frequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
dbRef.orderByChild("dateAdded")
     .on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        const sv = snapshot.val();
  
        // Console.loging the last trains's data
        console.log(sv);

        // Change the HTML to reflect
        trainName=sv.name;
        trainDestination=sv.destination;
        trainFirstTime=sv.firstTrainTime;
        trainFrequency=sv.frequency;

        // function call to display current train details
        displayTrainDetails();       
  
        // Handle the errorss
}, function(errorObject) {
       console.log("Errors handled: " + errorObject.code);
});

function displayTrainDetails(){

	var trainTR = $("<tr>");
	var nameTD =$("<td>").text(trainName);
	var destinationTD =$("<td>").text(trainDestination);
	var frequencyTD =$("<td>").text(trainFrequency);

  var diffTime = moment().diff(moment.unix(trainFirstTime), "minutes");
  var timeRemainder = moment().diff(moment.unix(trainFirstTime), "minutes") % trainFrequency ;
  var minutes = trainFrequency - timeRemainder;

      trainNextArrival = moment().add(minutes, "m").format("hh:mm A"); 

	var nextArrivalTD =$("<td>").text(trainNextArrival);
	var minsAwayTD =$("<td>").text(minutes);

	trainTR.append(nameTD,destinationTD,frequencyTD,nextArrivalTD,minsAwayTD);

	$("#dispTrain").append(trainTR);
}