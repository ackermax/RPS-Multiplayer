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

      isPlayer1 = true;
      db.ref("/playerSelect/player1").set(true);
      db.ref("playerSelect/player1").onDisconnect().set(false);
      //add player number to the name input div
      $("#player-number-span").text(player);

    }

    //if there's no player 2 and there is a player 1 you're player 2
    else if (isPlayer1 == true && isPlayer2 == false && player !== 1) {
      console.log("You are Player 2!");
      player = 2;

      isPlayer2 = true;
      db.ref("/playerSelect/player2").set(true);
      db.ref("playerSelect/player2").onDisconnect().set(false);
      $("#player-number-span").text(player);

    }

  });

  //we're gonna populate our chat log now with the firebase data
  db.ref("chatLog").on("child_added", function (snap) {
    //grab the name, player number, and text and stick em in variables for ease of use
    var chatName = snap.val().name;
    var chatPlayer = snap.val().player;
    var chatText = snap.val().text;

    //make a <p> tag and stick some text in there!
    $("<p>")
      .html("<span id='player" + chatPlayer + "-textname'>" + chatName + "</span>: " + chatText)
      //stick that stuff in the text box log thing!
      .appendTo("#chat-text");

    db.ref("chatLog").onDisconnect().remove();
  });

  //when someone clicks the send button to send a chat message
  $("#chat-submit").click(function (e) {
    //stop our button from doing things
    e.preventDefault();

    //grab the data in the input box and store it
    var chatText = $("#chat-input").val();

    //clear the input
    $("#chat-input").val("");

    //make sure you can't smacktalk if you don't have a name
    if (name == "") {
      alert("You can't smacktalk without a name, fool!")
    }
    else {
      //push that data up and the name to the Firebase database
      db.ref("chatLog").push({
        "name": name,
        "player": player,
        "text": chatText,
      });
    }
  });

  //when player name input is submitted
  $("#name-submit").click(function (e) {
    //stop that button
    e.preventDefault();

    //grab input val
    var nameVal = $("#name-input").val();

    //empty the input
    $("#name-input").val("");

    //check to see someone actually put in something as their name
    if (nameVal == "") {
      alert("You didn't enter a name. I can't call you nothing the entire game...")
    }
    else {
      //hide the name-select div
      $("#name-select").addClass("hide");

      //change the person's name
      name = nameVal;

      //let the player know we know their name
      $("<h2 id='welcome-message'>").text("Welcome to the game, " + name + "! Good luck!").prependTo("#game-container");

      //push that name up to firebase
      db.ref("/playerNames/player" + player).set({
        "name": name,
        "player": player
      })
      db.ref("/playerNames/player" + player).onDisconnect().remove();
    }
  });

  //when someone puts a name into firebase
  db.ref("/playerNames").on("child_added", function(snap){
    //we neeed to grab the info
    var playerName = snap.val().name;
    var playerPlayer = snap.val().player;
    console.log(playerPlayer);

    //make an h4 tag
    $("<h4>").addClass("score").attr("id", "player" + playerPlayer + "-score")
    //stick our html in there
    .html("Wins: <span id='player"+playerPlayer+"-wins'>0</span> | Losses: <span id='player"+playerPlayer+"-losses'>0</span>")
    //append it to the right gamespace
    .appendTo("#player"+playerPlayer+"-gamespace");

    //Let's change the waiting on Player part of our gamespaces
    $("#player" + playerPlayer + "-name").text(playerName);
  });
});