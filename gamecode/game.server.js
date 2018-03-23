/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström, 2013 Robert XD Hawkins
    
    written by : http://underscorediscovery.com
    written for : http://buildnewgames.com/real-time-multiplayer/
    
    modified for collective behavior experiments on Amazon Mechanical Turk

    MIT Licensed.
 */

var 
  fs          = require('fs'),
  utils       = require(__base + 'sharedUtils/sharedUtils.js');

// The server parses and acts on messages sent from 'clients'
var onMessage = function(client,message) {
  //Cut the message up into sub components
  var message_parts = message.split('.');
  
  //The first is always the type of message
  var message_type = message_parts[0];
  
  //Extract important variables
  var gc = client.game;
  var id = gc.id;
  var all = gc.get_active_players();
  var target = gc.get_player(client.userid);
  var others = gc.get_others(client.userid);

  switch(message_type) {
    
//   case 'clickedObj' :
// //    writeData(client, "clickedObj", message_parts);
//     others[0].player.instance.send('s.feedback.' + message_parts[1]);
//     target.instance.send('s.feedback.' + message_parts[1]);
//     setTimeout(function() {
//       _.forEach(all, function(p){
// 	p.player.instance.emit( 'newRoundUpdate', {user: client.userid});
//       });
//       gc.newRound();
//     }, 3000);
//     break;
  
//   case 'playerTyping' :
//     _.map(others, function(p) {
//       p.player.instance.emit( 'playerTyping',
// 			      {typing: message_parts[1]});
//     });
//     break;
  
//   case 'chatMessage' :
//     if(client.game.player_count == 2 && !gc.paused) {
// //      writeData(client, "message", message_parts);
//     }
//     // Update others
//     var msg = message_parts[1].replace(/~~~/g,'.');
//     _.map(all, function(p){
//       p.player.instance.emit( 'chatMessage', {user: client.userid, msg: msg});});
//     break;

//   case 'h' : // Receive message when browser focus shifts
//     target.visible = message_parts[1];
//     break;
  
  // start button

  case 'startButton':
   _.map(others, function(p) {
    var msg= message_parts[1]
    p.player.instance.emit('startButton', {msg: msg})
  });
  break; 

  
  // done training

  case 'donetraining':
   _.map(others, function(p) {
    var msg= message_parts[1]
    p.player.instance.emit('donetraining', {msg: msg})
   });
   break;

  // begin practice

  case 'beginPractice':
   _.map(others, function(p) {
    p.player.instance.emit('beginPractice')
   });
   break;
  
  // go to next practice trial
  case 'practiceselected'
   _.map(others, function(p) {
    p.player.instance.emit('practiceselected')
   });

  // done practice

  case 'done':
   _.map(others, function(p) {
    var msg= message_parts[1]
    p.player.instance.emit('done', {msg: msg})
   });
   break;


  // begin button

  case 'beginButton':    
   _.map(others, function(p) {
    p.player.instance.emit('beginButton')
  });
   break;


  // go to next trial
  case 'selected':
   _.map(others, function(p) {
    p.player.instance.emit('selected')
   });
   break;

  // finish game
  case 'end':
   _.map(others, function(p) {
    p.player.instance.emit('end')
   });
   break;


  }
}



function getIntendedTargetName(objects) {
  return _.filter(objects, function(x){
    return x.targetStatus == 'target';
  })[0]['name']; 
}

function getIntendedTargetOccurrence(objects) {
  return _.filter(objects, function(x){
    return x.targetStatus == 'target';
  })[0]['occurrence']; 
}

var writeData = function(client, type, message_parts) {
  var gc = client.game;
  var intendedName = getIntendedTargetName(gc.trialInfo.currStim);
  var occurrence = getIntendedTargetOccurrence(gc.trialInfo.currStim);
  var roundNum = gc.state.roundNum + 1;
  var line;
  switch(type) {
  case "clickedObj" :
    // parse the message
    var clickedName = message_parts[1];
    var correct = intendedName == clickedName ? 1 : 0;
    var objBox = message_parts[2];
    line = [gc.id, Date.now(), roundNum, occurrence, intendedName, clickedName, objBox, correct];
    break;

  case "message" :
    var msg = message_parts[1].replace('~~~','.');
    var timeElapsed = message_parts[2];
    line = [gc.id, Date.now(), roundNum, occurrence, client.role, intendedName, timeElapsed, msg];
    break;
  }
  console.log(type + ":" + line.join(','));
  gc.streams[type].write(line.join(',') + "\n", function (err) {if(err) throw err;});
};

var startGame = function(game, player) {
  console.log("starting game" + game.id);
  // Establish write streams
  var startTime = utils.getLongFormTime();
  var dataFileName = startTime + "_" + game.id;
  utils.establishStream(game, "message", dataFileName,
			"gameid,time,roundNum,occurrenceNum,sender,intendedName," +
			"timeElapsed,contents\n");
  utils.establishStream(game, "clickedObj", dataFileName,
			"gameid,time,roundNum,occurrenceNum,intendedObj," +
			"clickedObj,objBox,correct\n");
  game.newRound();
  game.server_send_update();
};

module.exports = {
  writeData : writeData,
  startGame : startGame,
  onMessage : onMessage
};
