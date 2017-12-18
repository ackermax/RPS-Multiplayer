$(document).ready(function(){
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDej6nxcO2oVuS8z7rR9UaDgMj1E0qPbfk",
    authDomain: "rps-multiplayer-d2a76.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-d2a76.firebaseio.com",
    projectId: "rps-multiplayer-d2a76",
    storageBucket: "rps-multiplayer-d2a76.appspot.com",
    messagingSenderId: "931279302878"
  };
  firebase.initializeApp(config);
  
  var dBase = firebase.database();

  console.log(dBase);
});