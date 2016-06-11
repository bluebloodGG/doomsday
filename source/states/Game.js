/* global Doomsday: true, Phaser: true */
'use strict';

Doomsday.Main = function(game) {
    this.game = game;

    this.map = null;
	this.layer = null;
	this.player = null;
	this.monsterManager = null;
};

Doomsday.Main.prototype.preload = function() {
	console.log('Main.preload');

};

Doomsday.Main.prototype.create = function() {

	// The 'mario' key here is the Loader key given in game.load.tilemap
	this.map = this.game.add.tilemap('level1');

	// The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
	// The second parameter maps this name to the Phaser.Cache key 'tiles'
	this.map.addTilesetImage('dungeon', 'tiles');
	//this.map.setCollision([2, 3, 6, 7, 8, 11, 12, 13, 16, 18]);

	//  Creates a layer from the World1 layer in the map data.
	//  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
	this.dungeon = this.map.createLayer('Dungeon');
	this.lava = this.map.createLayer('Lava');
	this.spawners = this.map.objects.Spawners;

	this.map.setCollisionBetween(10, 19, true, this.dungeon);
	this.map.setCollisionBetween(24, 35, true, this.lava);

	//  This resizes the game world to match the layer dimensions
	this.dungeon.resizeWorld();
	this.lava.resizeWorld();

	this.layerMonsters = this.game.add.group();
	this.layerPlayer = this.game.add.group();

	this.player = new Doomsday.Player(this.game, this.layerPlayer);
	this.monsterManager = new Doomsday.MonsterManager(this.game, this.player.torso, this.layerMonsters, this.spawners);

	this.monsterManager.generateMonsters(25);
	this.hud = new Doomsday.Hud(this.game, this.player);

	this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	this.key3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
	this.key1.onDown.add(this.onSelectWeapon, this, 0, 0);
	this.key2.onDown.add(this.onSelectWeapon, this, 0, 1);
	this.key3.onDown.add(this.onSelectWeapon, this, 0, 2);

	this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);
    this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.TWO);
    this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.THREE);

	this.game.score = 0;
	this.game.startTime = 0;
	this.game.elapsedTime = 0;
	this.game.startTime = this.game.time.time;
};

Doomsday.Main.prototype.update = function() {
	this.handleInput();
	this.player.update();
	this.monsterManager.update();
	this.hud.update();

	this.game.physics.arcade.overlap(this.player.weapons[this.player.currentWeapon].bullets, this.monsterManager.monsters, this.hit, null, this);
	this.game.physics.arcade.collide(this.player.torso, this.dungeon);
	this.game.physics.arcade.overlap(this.player.torso, this.monsterManager.monsters, this.monsterHitPlayer, null, this);
	this.game.physics.arcade.overlap(this.player.torso, this.lava, this.walkingOnLava, null, this);
	this.game.physics.arcade.collide(this.player.weapons[this.player.currentWeapon].bullets, this.dungeon, this.hitWall, null, this);

	var ms = (this.game.time.time - this.game.startTime)
	var sec = Math.round(ms/1000);
	this.game.elapsedTime = this.formatTime(sec);
};

Doomsday.Main.prototype.render = function() {
	this.monsterManager.render();
	var left = 16;
	var top = 64;
	this.game.debug.text("FPS: " + this.game.time.fps, left, top);
	this.game.debug.text("Frames: " + this.game.time.frames, left, top + 16);
	this.game.debug.text("MS Min: " + this.game.time.msMin, left, top + 32);
	this.game.debug.text("MS Max: " + this.game.time.msMax, left, top + 48);
	this.game.debug.text('1: Pistol, 2: Submachinegun', left, top + 64);
	this.game.debug.text('R: Reload', left, top + 80);
};

Doomsday.Main.prototype.monsterHitPlayer = function(player, monster) {
	player.parent.damage(monster.strength);
}
Doomsday.Main.prototype.hit = function(attacker, target) {
	//this.game.plugins.screenShake.start(20);

	target.damage(attacker.damage);
	if(target.health <= 0) {
		target.health = 0;
		this.game.score += target.worth;
	}

	if(attacker.parent.name === "Player") {
		attacker.parent.damage(1);
	}

	if(attacker.key === "bullet") {
		attacker.kill();
	}
};

Doomsday.Main.prototype.hitWall = function(attacker, target) {
	attacker.kill();
};

Doomsday.Main.prototype.walkingOnLava = function(player, lavaTile) {
	if(lavaTile.collides)
		this.player.damage(1);
};

Doomsday.Main.prototype.handleInput = function() {
	if (this.game.input.activePointer.leftButton.isDown) {
		this.player.fire();
	}
};

Doomsday.Main.prototype.onSelectWeapon = function(e, weaponIndex) {
	this.player.selectWeapon(weaponIndex);
};


Doomsday.Main.prototype.formatTime = function(s) {
	// Convert seconds (s) to a nicely formatted and padded time string
	var minutes = "0" + Math.floor(s / 60);
	var seconds = "0" + (s - minutes * 60);
	return minutes.substr(-2) + ":" + seconds.substr(-2);
};