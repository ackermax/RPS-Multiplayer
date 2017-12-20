$(document).ready(function () {
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

  //setting database  
  var db = firebase.database();

  //Let's try to make chat functionality

  //setting a local variable to tell whether I'm player one or not also setting my name (currently just as player)
  var player;
  var name = "";
  var isPlayer1;
  var isPlayer2;

  //trying to set up player one and two

  db.ref("/playerSelect").on("value", function (snap) {
    //pull down the player one and player 2 variables
    isPlayer1 = snap.child("player1").val();
    isPlayer2 = snap.child("player2").val();

    //if there's no player 1 you become player one
    if (isPlayer1 == false && player !== 2) {
      console.log("You are Player 1!");
      player = 1;
      name = "Player" + player;
      isPlayer1 = true;
      db.ref("/playerSelect/player1").set(true);
      db.ref("playerSelect/player1").onDisconnect().set(false);
    }

    //if there's no player 2 and there is a player 1 you're player 2
    else if (isPlayer1 == true && isPlayer2 == false && player !== 1) {
      console.log("You are Player 2!");
      player = 2;
      name = "Player" + player;
      isPlayer2 = true;
      db.ref("/playerSelect/player2").set(true);
      db.ref("playerSelect/player2").onDisconnect().set(false);
    }
  });

  //when someone clicks the send button to send a chat message
  $("#chat-submit").click(function(e){
    //stop our button from doing things
    e.preventDefault();
    
  });
});