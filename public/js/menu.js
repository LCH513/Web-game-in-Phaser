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
var bt;
function preload() {
  
	this.load.image('bg2', 'assets/bg2.png');
	this.load.image('button', 'assets/one.png');
}

function create(){
	this.add.image(600, 450, 'bg2');
	bt = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
	bt.onInputOver.add(over, this);
    bt.onInputOut.add(out, this);
    bt.onInputUp.add(up, this);
}
function actionOnClick () {

    this.socket = io();
	socket.emit('buttonClick');
}