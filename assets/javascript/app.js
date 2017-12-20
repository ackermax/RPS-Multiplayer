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

  //setting global variables
  var player;
  var name = "";
  var isPlayer1;
  var isPlayer2;
  var gameStep;
  var player1Choice = "";
  var player2Choice = "";
  var player1Wins = 0;
  var player2Wins = 0;
  var player1Losses = 0;
  var player2Losses = 0;
  var player1Name = "";
  var player2Name = "";

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
    var chatName = snap.val().name + ": ";
    var chatPlayer = snap.val().player;
    var chatText = snap.val().text;

    //make a <p> tag and stick some text in there!
    $("<p>")
      .html("<span id='player" + chatPlayer + "-textname'>" + chatName + "</span>" + chatText)
      //stick that stuff in the text box log thing!
      .appendTo("#chat-text");


    db.ref("/chatLog").onDisconnect().remove();

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
  db.ref("/playerNames").on("child_added", function (snap) {
    //we neeed to grab the info
    var playerName = snap.val().name;
    var playerPlayer = snap.val().player;
    console.log(playerPlayer);

    if (playerPlayer == 1) {
      player1Name = playerName;
    }
    else if (playerPlayer == 2) {
      player2Name = playerName;
    }

    //make an h4 tag
    $("<h4>").addClass("score").attr("id", "player" + playerPlayer + "-score")
      //stick our html in there
      .html("Wins: <span id='player" + playerPlayer + "-wins'>0</span> | Losses: <span id='player" + playerPlayer + "-losses'>0</span>")
      //append it to the right gamespace
      .appendTo("#player" + playerPlayer + "-gamespace");

    //Let's change the waiting on Player part of our gamespaces
    $("#player" + playerPlayer + "-name").text(playerName);
  });

  db.ref("/playerNames").on("value", function (snap) {
    //check if player 1 and player 2 have signed in
    if (snap.child("player1").exists() && snap.child("player2").exists()) {
      //start the game
      db.ref("/gameStep").set({
        "step": 1
      });
      db.ref("/gameStep").onDisconnect().set({
        "step": 0
      });
    }
  });

  //check to see what step of the game we are on
  db.ref("/gameStep").on("value", function (snap) {
    //grab the game step and save it
    gameStep = snap.val().step;
    //now we write code based on which step it is

    //step 1:
    if (gameStep == 1) {
      //empty the divs
      $("#player1-choice").empty();
      $("#player2-choice").empty();
      $("#results").empty();

      //clear any choices if they were there from the last round
      db.ref("/playerChoice").set(null);

      //add stuff to results that says we're in a game
      $("<h2>").text("It's go time!").appendTo("#results");

      //add the border to player 1
      $("#player1-gamespace").addClass("lightborder");
      //if you're player 1 you get to choose
      if (player == 1) {
        $("#player1-choice")
          .html("<div class='rps-choice' choice='rock'><p>Rock</p></div><br><div class='rps-choice' choice='paper'><p>Paper</p></div><br><div class='rps-choice' choice='scissors'><p>Scissors</p>");
      }
    }
    //step 2:
    else if (gameStep == 2) {
      //add the border to player 2
      $("#player2-gamespace").addClass("lightborder");
      //remove border from player 1
      $("#player1-gamespace").removeClass("lightborder");
      //if you're player 2 you get to choose
      if (player == 2) {
        $("#player2-choice")
          .html("<div class='rps-choice' choice='rock'><p>Rock</p></div><br><div class='rps-choice' choice='paper'><p>Paper</p></div><br><div class='rps-choice' choice='scissors'><p>Scissors</p>");
      }

    }
    //step 3:
    else if (gameStep == 3) {
      //remove the lightborder
      $("#player2-gamespace").removeClass("lightborder");
      //show the choice in each player's div
      $("#player1-choice").empty();
      $("#player2-choice").empty();
      $("<h2>").text(player1Choice).appendTo("#player1-choice");
      $("<h2>").text(player2Choice).appendTo("#player2-choice");
      console.log(player1Choice + " " + player2Choice);
      //let's figure out who wins!

      //it's a tie!
      if (player1Choice == player2Choice) {
        $("#results").empty();
        $("<h2>").text("It's a tie!").appendTo("#results");

      }
      else if (player1Choice == "rock") {
        if (player2Choice == "paper") {
          player1Losses++;
          player2Wins++;

          $("#results").empty();
          $("<h2>").text(player2Name + " wins!").appendTo("#results");
        }
        else if (player2Choice == "scissors") {
          player1Wins++;
          player2Losses++;

          $("#results").empty();
          $("<h2>").text(player1Name + " wins!").appendTo("#results");
        }
      }
      else if (player1Choice == "paper") {
        if (player2Choice == "scissors") {
          player1Losses++;
          player2Wins++;

          $("#results").empty();
          $("<h2>").text(player2Name + " wins!").appendTo("#results");
        }
        else if (player2Choice == "rock") {
          player1Wins++;
          player2Losses++;

          $("#results").empty();
          $("<h2>").text(player1Name + " wins!").appendTo("#results");
        }
        else if (player1Choice == "scissors") {
          if (player2Choice == "rock") {
            player1Losses++;
            player2Wins++;

            $("#results").empty();
            $("<h2>").text(player2Name + " wins!").appendTo("#results");
          }
          else if (player2Choice == "paper") {
            player1Wins++;
            player2Losses++;

            $("#results").empty();
            $("<h2>").text(player1Name + " wins!").appendTo("#results");
          }
        }
      }
      //send the scores up to the database
      db.ref("playerScores").set({
        "p1wins": player1Wins,
        "p1losses": player1Losses,
        "p2wins": player2Wins,
        "p2losses": player2Losses
      })
      //put the scores in the divs
      $("#player1-wins").text(player1Wins);
      $("#player2-wins").text(player2Wins);
      $("#player1-losses").text(player1Losses);
      $("#player2-losses").text(player2Losses);

      //after 3 seconds we start it all over again
      setTimeout(function () {
        //set gameStep to 1 and push it up
        gameStep = 1;
        db.ref("/gameStep").set({
          "step": gameStep
        });
      }, 3000);
    }
  });

  //when a player clicks a choice
  $(document).on("click", ".rps-choice", function () {
    //store the choice
    var userChoice = $(this).attr("choice");
    //are they player 1 or 2?
    if (player == 1) {
      //store it in the player 1 choice variable
      player1Choice = userChoice;
      //empty player1-choice
      gameStep = 2;
      //set the choice in the database
      db.ref("/playerChoice/player1").set({
        "choice": player1Choice,
        "player": 1
      });
      db.ref("/playerChoice/player1").onDisconnect().remove();
      //move the step up in the database
      db.ref("/gameStep").set({
        "step": gameStep
      });
      //set the gameStep to 2 and push that up
      $("#player1-choice").empty();
      //add choice to same div
      $("<h2>").text(player1Choice).appendTo("#player1-choice");
    }
    else if (player == 2) {
      //store it in the player 2 choice variable
      player2Choice = userChoice;
      //set the choice in the database
      db.ref("/playerChoice/player2").set({
        "choice": player2Choice,
        "player": 2
      });
      db.ref("/playerChoice/player2").onDisconnect().remove();
      //set the gameStep to 3 and push that up
      gameStep = 3;
      db.ref("/gameStep").set({
        "step": gameStep
      });
      //set the gameStep to 2 and push that up
      $("#player2-choice").empty();
      //add choice to same div
      $("<h2>").text(player2Choice).appendTo("#player2-choice");
    }
  });

  //update the playerchoice when we get one from firebase
  db.ref("/playerChoice").on("child_added", function (snap) {
    if (snap.val().player == 1) {
      player1Choice = snap.val().choice;
    }
    else if (snap.val().player == 2) {
      player2Choice = snap.val().choice;
    }
  });
});