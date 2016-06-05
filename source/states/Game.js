/* global Doomsday: true, Phaser: true */
'use strict';

Doomsday.Main = function(game) {
    this.game = game;

    this.map = null;
	this.layer = null;
	this.player = null;
	this.enemy = null;
	this.zombies = [];
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
	this.map.setCollision([2, 3, 6, 7, 8, 11, 12, 13, 16, 18]);
	//  Creates a layer from the World1 layer in the map data.
	//  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
	this.layer = this.map.createLayer('Dungeon');

	//  This resizes the game world to match the layer dimensions
	this.layer.resizeWorld();

	this.player = new Doomsday.Player(this.game);
	this.monsterManager = new Doomsday.MonsterManager(this.game, this.player.torso);
	this.monsterManager.generateMonsters(100);


};

Doomsday.Main.prototype.update = function() {
	this.player.update();
	this.monsterManager.update();

	for (var i in this.zombies) {
		var z = this.zombies[i];
		var zs = this.zombies[i].sprite;
		if (zs.alive) {
			this.game.physics.arcade.collide(this.player.sprite, zs);
			var hit = this.game.physics.arcade.overlap(this.player.weapon.bullets, zs, this.bulletHitEnemy, null, this);
			if (hit) {
				z.onHit(this.player.weapon.damage);
			}
			z.update();
		}
	}

	this.game.physics.arcade.overlap(this.monsterManager.monsters, this.player.weapon.bullets, this.hit, null, this);

	this.game.physics.arcade.collide(this.player, this.layer);
};

Doomsday.Main.prototype.render = function() {
	this.monsterManager.render();
	var left = 8;
	var top = 16;
	this.game.debug.text("FPS: " + this.game.time.fps, left, top);
	this.game.debug.text("Frames: " + this.game.time.frames, left, top + 16);
	this.game.debug.text("MS Min: " + this.game.time.msMin, left, top + 32);
	this.game.debug.text("MS Max: " + this.game.time.msMax, left, top + 48);
	this.game.debug.text('1: Pistol, 2: Submachinegun', left, top + 64);
};

Doomsday.Main.prototype.hit = function(target, attacker) {
	this.game.plugins.screenShake.start(20);

	target.damage(attacker.strength);
	if(target.health <= 0) { target.health = 0; }

	if(attacker.key === "bullet") {
		attacker.kill();
	}
};
