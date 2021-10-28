var config = {
	type: Phaser.AUTO,
	parent: 'phaser-example',
	width: 1800,
	height: 900,
	physics: {
		default: 'arcade',
		arcade: {
		debug: false,
		gravity: { y: 0 }
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	} 
};

var game = new Phaser.Game(config);
const numSpacer = 6;
var counter = 60;

var background;
var q_text;
var selectionText1;
var selectionText2;
var selectionText3;
var selectionText4;

var playSelectionText1;
var playSelectionText2;
var playSelectionText3;
var playSelectionText4;

var boundA;
var boundB;
var boundC;
var boundD;

var question = ['正言__色', '引錐刺__', '愛__如命', '__少成多', '安居樂__', '__淡無光', '百步穿__',
				'__官野史'];
var completeQ = ['正言厲色', '引錐刺股', '愛財如命', '積少成多', '安居樂業', '暗淡無光', '百步穿楊',
				'稗官野史']
var select1 = ['力', '股', '才', '蹟', '業', '黯', '陽', '椑'];
var select2 = ['厲', '古', '材', '績', '葉', '闇', '揚', '稗'];
var select3 = ['利', '鼓', '財', '機', '頁', '按', '楊', '碑'];
var select4 = ['莉', '骨', '裁', '積', '夜', '暗', '暘', '埤'];
var answer = [2, 1, 3, 4, 1, 4, 3, 2];





function preload() {
  
	this.load.image('head', 'assets/spaceShips_001.png');
	this.load.image('otherPlayer', 'assets/enemyBlack5.png');
	this.load.image('snakeBody', 'assets/snake.png');
	this.load.image('bg', 'assets/bg.png');
	this.load.image('bg2', 'assets/bg2.png');
	this.load.image('one', 'assets/one.png');
	this.load.image('two', 'assets/two.png');
	this.load.image('three', 'assets/three.png');
	this.load.image('four', 'assets/four.png');
}

function create() {
	var self = this;

	this.add.image(600, 450, 'bg2');
	this.ownBody = this.physics.add.group();
	this.socket = io();
	
	
	background = this.physics.add.image(1500, 455, 'bg');
	background.setImmovable();
	

	
	this.otherBodies = this.physics.add.group();
	this.otherPlayers = this.physics.add.group();
	this.socket.on('currentPlayers', function (players) {
		Object.keys(players).forEach(function (id) {
			if (players[id].playerId === self.socket.id) {
				addPlayer(self, players[id]);
			} 
			else {
				addOtherPlayers(self, players[id]);
			}
		});
	});
	this.socket.on('newPlayer', function (playerInfo) {
		addOtherPlayers(self, playerInfo);
	});
	this.socket.on('disconnect', function (playerId) {

		if(self.otherPlayers[playerId]){
			var otherPlayer = self.otherPlayers[playerId];
			otherPlayer.head.destroy();
			for (var i = 1; i < otherPlayer['body'].length; i++) { 
				otherPlayer['body'][i].destroy();
			}
			delete self.otherPlayers[playerId];      
		}
	});
	this.socket.on('playerMoved', function (playerInfo) {

		var otherPlayer = self.otherPlayers[playerInfo.playerId];

		otherPlayer.head.setRotation(playerInfo.rotation);
		otherPlayer.head.setPosition(playerInfo.x, playerInfo.y);
		var segment = otherPlayer['path'].pop();
		segment = {x: otherPlayer.head.x, y: otherPlayer.head.y};

		otherPlayer['path'].unshift(segment);
		for (var i = 1; i<=playerInfo.len-1; i++)
		{
		otherPlayer['body'][i].x = (otherPlayer['path'][i * numSpacer]).x;
		otherPlayer['body'][i].y = (otherPlayer['path'][i * numSpacer]).y;
		}
	});
	this.cursors = this.input.keyboard.createCursorKeys();

	this.overText = this.add.text(1375, 200, '', {fontSize: '32px Arial', fill:'#FFFFFF' });

	this.blueScoreText = this.add.text(60, 50, '', { fontSize: '50px Arial Black', fill: '#0000FF' });
	this.blueScoreText.stroke = "#de77ae";
    this.blueScoreText.strokeThickness = 16;
    this.blueScoreText.setShadow(2, 2, "#333333", 2, true, true);
	
	this.redScoreText = this.add.text(990, 50, '', { fontSize: '50px Arial Black', fill: '#FF0000' });
	this.redScoreText.stroke = "#de77ae";
    this.redScoreText.strokeThickness = 16;
    this.redScoreText.setShadow(2, 2, "#333333", 2, true, true);
	
	this.q_text = this.add.text(1375, 300, '', {fontSize: '32px Arial', fill:'#FFFFFF' });
	
	this.selectionText1 = this.add.text(1375, 400, '', {fontSize: '32px Arial', fill:'#FFFFFF' });
	this.selectionText2 = this.add.text(1375, 450, '', {fontSize: '32px Arial', fill:'#FFFFFF' });
	this.selectionText3 = this.add.text(1375, 500, '', {fontSize: '32px Arial', fill:'#FFFFFF' });
	this.selectionText4 = this.add.text(1375, 550, '', {fontSize: '32px Arial', fill:'#FFFFFF' });

	
	
	this.socket.on('scoreUpdate', function (scores,completeQ) {
		
		self.blueScoreText.setText('藍隊: ' + scores.blue);
		self.redScoreText.setText('紅隊: ' + scores.red);
		if(scores.blue == 100){
			self.overText.setText('藍隊獲勝!');
		}
		if(scores.red == 100){
			self.overText.setText('紅隊獲勝!');
		}
		if(scores.red == 100 || scores.blue == 100){
			self.choice1.destroy();
			self.choice2.destroy();
			self.choice3.destroy();
			self.choice4.destroy();
			self.playSelectionText1.destroy();
			self.playSelectionText2.destroy();
			self.playSelectionText3.destroy();
			self.playSelectionText4.destroy();
			self.selectionText1.destroy();
			self.selectionText2.destroy();
			self.selectionText3.destroy();
			self.selectionText4.destroy();
			self.q_text.destroy();
		}
		
		});
	
	
	this.socket.on('starLocation', function (starLocation) {
		
		console.log(starLocation.q_flag);
		console.log(answer[(starLocation.q_flag)-1]);
		
		
		if (self.choice1 || self.choice2 || self.choice3 || self.choice4) 
		{
			self.choice1.destroy();
			self.choice2.destroy();
			self.choice3.destroy();
			self.choice4.destroy();
			self.playSelectionText1.destroy();
			self.playSelectionText2.destroy();
			self.playSelectionText3.destroy();
			self.playSelectionText4.destroy();
			
		}
		

		
		self.choice1 = self.physics.add.image(starLocation.x1, starLocation.y1, 'one').setDisplaySize(60,60);
		self.choice2 = self.physics.add.image(starLocation.x2, starLocation.y2, 'two').setDisplaySize(60,60);
		self.choice3 = self.physics.add.image(starLocation.x3, starLocation.y3, 'three').setDisplaySize(60,60);
		self.choice4 = self.physics.add.image(starLocation.x4, starLocation.y4, 'four').setDisplaySize(60,60);
		
		self.choice1.visible = false;
		self.choice2.visible = false;
		self.choice3.visible = false;
		self.choice4.visible = false;
		
		
		if(Math.abs(starLocation.x1 - starLocation.x2) < 30 && Math.abs(starLocation.y1 - starLocation.y2) < 30){
			console.log('overlap');
			this.socket.emit('starCollected3');
		}
		else if(Math.abs(starLocation.x1 - starLocation.x3) < 30 && Math.abs(starLocation.y1 - starLocation.y3) < 30){
			console.log('overlap');
			this.socket.emit('starCollected3');
		}
		else if(Math.abs(starLocation.x1 - starLocation.x4) < 30 && Math.abs(starLocation.y1 - starLocation.y4) < 30){
			console.log('overlap');
			this.socket.emit('starCollected3');
		}
		else if(Math.abs(starLocation.x2 - starLocation.x3) < 30 && Math.abs(starLocation.y2 - starLocation.y3) < 30){
			console.log('overlap');
			this.socket.emit('starCollected3');
		}
		else if(Math.abs(starLocation.x2 - starLocation.x4) < 30 && Math.abs(starLocation.y2 - starLocation.y4) < 30){
			console.log('overlap');
			this.socket.emit('starCollected3');
		}
		else if(Math.abs(starLocation.x3 - starLocation.x4) < 30 && Math.abs(starLocation.y3 - starLocation.y4) < 30){
			console.log('overlap');
			this.socket.emit('starCollected3');
		}
		
		self.playSelectionText1 = self.add.text((starLocation.x1)-25, (starLocation.y1)-25, select1[(starLocation.q_flag)-1], {fontSize: '50px Arial', fill:'#000000' });
		self.playSelectionText2 = self.add.text((starLocation.x2)-25, (starLocation.y2)-25, select2[(starLocation.q_flag)-1], {fontSize: '50px Arial', fill:'#000000' });
		self.playSelectionText3 = self.add.text((starLocation.x3)-25, (starLocation.y3)-25, select3[(starLocation.q_flag)-1], {fontSize: '50px Arial', fill:'#000000' });
		self.playSelectionText4 = self.add.text((starLocation.x4)-25, (starLocation.y4)-25, select4[(starLocation.q_flag)-1], {fontSize: '50px Arial', fill:'#000000' });
		
		self.q_text.setText('題目:   ' + question[(starLocation.q_flag)-1]);
		
		self.selectionText1.setText('選項1:   ' + select1[(starLocation.q_flag)-1]);
		self.selectionText2.setText('選項2:   ' + select2[(starLocation.q_flag)-1]);
		self.selectionText3.setText('選項3:   ' + select3[(starLocation.q_flag)-1]);
		self.selectionText4.setText('選項4:   ' + select4[(starLocation.q_flag)-1]);
				
		
		if(answer[(starLocation.q_flag)-1] == 1){
			self.physics.add.overlap(self.head, self.choice1, function () {
				this.socket.emit('starCollected');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice2, function () {
				this.socket.emit('starCollected2');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice3, function () {
				this.socket.emit('starCollected2');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice4, function () {
				this.socket.emit('starCollected2');
			}, null, self);
		}
		
		if(answer[(starLocation.q_flag)-1] == 2){
			self.physics.add.overlap(self.head, self.choice2, function () {
				this.socket.emit('starCollected');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice1, function () {
				this.socket.emit('starCollected2');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice3, function () {
				this.socket.emit('starCollected2');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice4, function () {
				this.socket.emit('starCollected2');
			}, null, self);
		}
		
		if(answer[(starLocation.q_flag)-1] == 3){
			self.physics.add.overlap(self.head, self.choice3, function () {
				this.socket.emit('starCollected');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice2, function () {
				this.socket.emit('starCollected2');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice1, function () {
				this.socket.emit('starCollected2');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice4, function () {
				this.socket.emit('starCollected2');
			}, null, self);
		}
		
		if(answer[(starLocation.q_flag)-1] == 4){
			self.physics.add.overlap(self.head, self.choice4, function () {
				this.socket.emit('starCollected');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice2, function () {
				this.socket.emit('starCollected2');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice3, function () {
				this.socket.emit('starCollected2');
			}, null, self);
			self.physics.add.overlap(self.head, self.choice1, function () {
				this.socket.emit('starCollected2');
			}, null, self);
		}
		
		
		
		
	});
  
	this.socket.on('gameOver', function(flag){
		StopGame(); 
	});
	this.socket.on('gameRestart', function(flag){
		StartGame();
	});
}


function StartGame(){
	game.scene.resume("default");
}

function StopGame(){
	game.scene.pause("default");
	
}

function addPlayer(self, playerInfo) {
	self.snakeLength = playerInfo.len;
	self.snakeBody = Array(playerInfo.len);
	self.snakePath = Array(playerInfo.len*numSpacer);
	self.head = self.physics.add.image(playerInfo.x, playerInfo.y, 'head').setOrigin(0.5, 0.5).setDisplaySize(40, 40).setCollideWorldBounds(true);
  
	for(let i =1; i<=playerInfo.len-1; i++){

		self.snakeBody[i] = self.physics.add.image(playerInfo.x,playerInfo.y,'snakeBody').setOrigin(0.5,0.5);

		if(i>2){
		self.ownBody.add(self.snakeBody[i]);      
		}
	}

	for (var i = 0; i < self.snakeLength*numSpacer; i++) {

		self.snakePath[i] = {x: playerInfo.x, y: playerInfo.y};

	}
  
	if (playerInfo.team === 'blue') {
		self.head.setTint(0x0000ff);
	} else {
		self.head.setTint(0xff0000);
	}
	self.head.setDrag(100);
	self.head.setAngularDrag(100);
	self.head.setMaxVelocity(200);
	//
}

function addOtherPlayers(self, playerInfo) {
	var otherPlayer = {};
  
	otherPlayer.head = self.add.sprite(playerInfo.x, playerInfo.y, 'head').setOrigin(0.5, 0.5).setDisplaySize(40, 40);
	otherPlayer['body'] = new Array();
	otherPlayer['path'] = playerInfo['path'];
  
	otherPlayer.head.setRotation(playerInfo.rotation);
	for(let i =1; i<=playerInfo.len-1; i++){
		otherPlayer['body'][i] = self.add.sprite(playerInfo['body'][i].x, playerInfo['body'][i].y,'snakeBody').setOrigin(0.5,0.5);
		otherPlayer['body'][i].playerId = playerInfo.playerId;
		self.otherBodies.add(otherPlayer['body'][i])
	}
  

  

	self.otherPlayers[playerInfo.playerId] = otherPlayer;
}

function update() {
	if (this.head) {
		
		this.physics.world.collide(background,this.head);
		
		if (this.cursors.left.isDown) {
			this.head.setAngularVelocity(-150);
		} 
		else if (this.cursors.right.isDown) {
			this.head.setAngularVelocity(150);
		} 
		else {
			this.head.setAngularVelocity(0);
		}
  
		if (this.cursors.up.isDown) {
			this.physics.velocityFromRotation(this.head.rotation+1.5 , 100, this.head.body.acceleration);
		} 
		else {
			this.head.setAcceleration(0);
		}
  
		var segment = this.snakePath.pop();
		segment = {x: this.head.x, y: this.head.y};
	
		this.snakePath.unshift(segment);
		for (var i = 1; i<=this.snakeLength-1; i++){
			this.snakeBody[i].x = (this.snakePath[i * numSpacer]).x;
			this.snakeBody[i].y = (this.snakePath[i * numSpacer]).y;
		}
	
		this.physics.world.wrap(this.head, 5);

		// emit player movement
		var x = this.head.x;
		var y = this.head.y;
		var r = this.head.rotation;
		if (this.head.oldPosition && (x !== this.head.oldPosition.x || y !== this.head.oldPosition.y || r !== this.head.oldPosition.rotation)) {
			this.socket.emit('playerMovement', { x: this.head.x, y: this.head.y, rotation: this.head.rotation, body: this.snakeBody, path: this.snakePath});
		}
		// save old position data
		this.head.oldPosition = {
			x: this.head.x,
			y: this.head.y,
			rotation: this.head.rotation
		};
	}
}