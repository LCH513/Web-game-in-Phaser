var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);


var players = {};
var star = {
	x1: Math.floor(Math.random() * 900) + 100 ,
	y1: Math.floor(Math.random() * 600)  + 100,
	
	x2: Math.floor(Math.random() * 900)  + 100,
	y2: Math.floor(Math.random() * 600) + 100 ,
	
	x3: Math.floor(Math.random() * 900) + 100 ,
	y3: Math.floor(Math.random() * 600) + 100 ,
	
	x4: Math.floor(Math.random() * 900)  + 100,
	y4: Math.floor(Math.random() * 600)  + 100,
	
	q_flag : Math.ceil(Math.random()*8)
};

const initNumSegments = 12;
const numSpacer = 6;
var teamDis = 0;
var flag = 0;
//var q_flag = Math.ceil(Math.random()*4);

var scores = {
	blue: 0,
	red: 0
};
var completeQ = [];
var completeQ_flag = 0;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

//server.listen(8001,"192.168.1.108");

io.on('connection', function (socket) {
	
	
	console.log('a user connected: ', socket.id);
	// create a new player and add it to our players object
  
	var randX = Math.floor(Math.random() * 900) + 100;
	var randY = Math.floor(Math.random() * 600) + 100;
	players[socket.id] = {
		rotation: 0,
		x: randX,
		y: randY,
		playerId: socket.id,
		len: initNumSegments,
		team: (teamDis == 0) ? 'red' : 'blue',
		path: new Array(numSpacer*initNumSegments).fill({x: randX, y: randY}),
		body: new Array(initNumSegments).fill({x: randX, y: randY})
	};
	teamDis+= 1;
	if(teamDis < 3){
	// send the players object to the new player
	socket.emit('currentPlayers', players);
	
	//socket.emit('CreateQuestion', q_flag);
	
	// send the star object to the new player
	socket.emit('starLocation', star);
	// send the current scores
	socket.emit('scoreUpdate', scores);
	// update all other players of the new player
	socket.broadcast.emit('newPlayer', players[socket.id]);
	if(teamDis < 2){
		io.emit('gameOver', flag);
	}
	else{
		io.emit('gameRestart', flag);
	}
	}
	// when a player disconnects, remove them from our players object
	socket.on('disconnect', function () {
		console.log('user disconnected: ', socket.id);
		delete players[socket.id];
		// emit a message to all players to remove this player
		io.emit('disconnect', socket.id);
	});

	// when a player moves, update the player data
	socket.on('playerMovement', function (movementData) {
		players[socket.id].x = movementData.x;
		players[socket.id].y = movementData.y;
		players[socket.id].rotation = movementData.rotation;
		// emit a message to all players about the player that moved
		socket.broadcast.emit('playerMoved', players[socket.id]);
	});
	

	socket.on('starCollected', function () {
		if (players[socket.id].team === 'red') {
			scores.red += 10;
		} 
		else{
			scores.blue += 10;
		}
	
		if(scores.red == 100 || scores.blue == 100){
			io.emit('scoreUpdate', scores);
			io.emit('gameOver', flag);
		}
		else{
			star.x1 = Math.floor(Math.random() * 900) + 100;
			star.y1 = Math.floor(Math.random() * 600) + 100;
			
			star.x2 = Math.floor(Math.random() * 900) + 100;
			star.y2 = Math.floor(Math.random() * 600) + 100;
			
			star.x3 = Math.floor(Math.random() * 900) + 100;
			star.y3 = Math.floor(Math.random() * 600) + 100;
			
			star.x4 = Math.floor(Math.random() * 900) + 100;
			star.y4 = Math.floor(Math.random() * 600) + 100;
			
			star.q_flag = Math.ceil(Math.random()*8);
			io.emit('starLocation', star);
			io.emit('scoreUpdate', scores);
			
			
		}
	
	});
	
	socket.on('starCollected2', function () {
		if (players[socket.id].team === 'red') {
			scores.red -= 10;
		} 
		else{
			scores.blue -= 10;
		}
		/*completeQ[completeQ_flag] = star.q_flag;
		completeQ_flag += 1;*/
		
		star.x1 = Math.floor(Math.random() * 900) + 100;
		star.y1 = Math.floor(Math.random() * 600) + 100;
			
		star.x2 = Math.floor(Math.random() * 900) + 100;
		star.y2 = Math.floor(Math.random() * 600) + 100;
			
		star.x3 = Math.floor(Math.random() * 900) + 100;
		star.y3 = Math.floor(Math.random() * 600) + 100;
			
		star.x4 = Math.floor(Math.random() * 900) + 100;
		star.y4 = Math.floor(Math.random() * 600) + 100;
			
			
		star.q_flag = Math.ceil(Math.random()*8);
			
		io.emit('starLocation', star);
		io.emit('scoreUpdate', scores);
	});
	
	socket.on('starCollected3', function(){
		star.x1 = Math.floor(Math.random() * 900) + 100;
		star.y1 = Math.floor(Math.random() * 600) + 100;
			
		star.x2 = Math.floor(Math.random() * 900) + 100;
		star.y2 = Math.floor(Math.random() * 600) + 100;
			
		star.x3 = Math.floor(Math.random() * 900) + 100;
		star.y3 = Math.floor(Math.random() * 600) + 100;
			
		star.x4 = Math.floor(Math.random() * 900) + 100;
		star.y4 = Math.floor(Math.random() * 600) + 100;
			
			
		star.q_flag = Math.ceil(Math.random()*8);
		io.emit('starLocation', star);
	});
});

//修改連線
server.listen(8001, function () {
	console.log(`Listening on ${server.address().port}`);
});
