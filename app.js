// Firebase Credentials
var firebaseConfig = {
    apiKey: "AIzaSyCCZCjMLlLTwsN972bxBuEheLCzAXvxcXg",
    authDomain: "train-time-6209f.firebaseapp.com",
    databaseURL: "https://train-time-6209f.firebaseio.com",
    projectId: "train-time-6209f",
    storageBucket: "",
    messagingSenderId: "914400423341",
    appId: "1:914400423341:web:6abb7a18e9443990f10524"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database
var name = '';
var destination = '';
var firstTrain = '';
var frequency = '';
var dateCreated = '';
var database = firebase.database();

$('#add-train').on('click', function (event) {
    event.preventDefault();

    name = $('#name-input').val().trim();
    destination = $('#destination-input').val().trim();
    firstTrain = $('#firstTrain-input').val().trim();
    frequency = $('#frequency-input').val().trim();

    database.ref("/train").push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateCreated: firebase.database.ServerValue.TIMESTAMP
    });
    $("#myForm").trigger('reset');
});

database.ref('/train').on('child_added', function (snapshot) {

    name = snapshot.val().name;
    destination = snapshot.val().destination;
    firstTrain = snapshot.val().firstTrain;
    frequency = snapshot.val().frequency;

    var trainMilTime = moment(firstTrain, 'HH:mm');
    var currentTime = moment().format('HH:mm');
    var minArrival = moment().diff(trainMilTime, 'minutes');
    var trainArrival = minArrival % frequency;
    var minAway = frequency - trainArrival;
    var nextTrain = moment().add(minAway, 'minutes');
    var arrivalTime = nextTrain.format('HH:mm');

    console.log('minAway ', minAway);
    //var momentFrequency = currentTime.duration(frequency, "mintues");
    //var minArrival = currentTime.diff(trainMilTime, 'mintues');
    //console.log('momentfrequency', momentFrequency);
    console.log('currenttime', currentTime);
    console.log('trainMiltime', trainMilTime);
    console.log('minArrival', minArrival);
    
    // full list of items to the table
    $("#train-data").append("<tr class='train-display'>" +
        '<td>' + name + '</td>' +
        '<td>' + destination + '</td>' +
        '<td>' + frequency + '</td>' + 
        '<td>' + arrivalTime + '</td>' +
        '<td>' + minAway + '</td>' +
        '</tr>');

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});