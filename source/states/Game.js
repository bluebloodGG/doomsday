/* global Doomsday: true, Phaser: true */
'use strict';

Doomsday.Main = function(game) {
    this.game = game;

    this.map = null;
	this.layer = null;
	this.player = null;
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

	this.waveManager = new Doomsday.WaveManager(this.game, this.player, this.layerMonsters, this.spawners);
	this.waveManager.start();

	this.hud = new Doomsday.Hud(this.game, this.player, this.waveManager);

	this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	this.key3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
	this.key1.onDown.add(this.onSelectWeapon, this, 0, 0);
	this.key2.onDown.add(this.onSelectWeapon, this, 0, 1);
	this.key3.onDown.add(this.waveManager.nextWave, this.waveManager, 0, 2);

	this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);
    this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.TWO);
    this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.THREE);


	this.game.score = 0;
	this.game.startTime = 0;
	this.game.elapsedTime = 0;
	this.game.lastTookDamage = 0;
	this.game.gameTime = this.game.time.create(false);
	this.game.gameTime.start();

	this.player.onDeath.add(this.handlePlayerDeath, this);
};

Doomsday.Main.prototype.update = function() {
	if(!this.waveManager.waveInProgress) {
		this.game.gameTime.pause()
		return;
	} else {
		this.game.gameTime.resume();
	}

	if(this.player.alive) {
		this.game.elapsedTime = this.formatTime(this.game.gameTime.seconds);
	}

	this.handleInput();
	this.player.update();
	this.waveManager.update();
	this.hud.update();

	this.game.physics.arcade.overlap(this.player.weapons[this.player.currentWeapon].bullets, this.waveManager.getCurrentWaveMonsters(), this.hit, null, this);
	this.game.physics.arcade.collide(this.player.torso, this.dungeon);
	this.game.physics.arcade.overlap(this.player.torso, this.waveManager.getCurrentWaveMonsters(), this.monsterHitPlayer, null, this);
	this.game.physics.arcade.overlap(this.player.torso, this.lava, this.walkingOnLava, null, this);
	this.game.physics.arcade.collide(this.player.weapons[this.player.currentWeapon].bullets, this.dungeon, this.hitWall, null, this);
};

Doomsday.Main.prototype.render = function() {
	this.waveManager.render();
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
	if(this.game.time.time < this.game.lastTookDamage) return;

	player.parent.damage(monster.strength);
	this.game.lastTookDamage = this.game.time.time + 500;
	this.game.plugins.screenShake.start(20);
}
Doomsday.Main.prototype.hit = function(attacker, target) {
	//this.game.plugins.screenShake.start(20);

	target.damage(attacker.damage);
	if(target.health <= 0) {
		target.health = 0;
		this.game.score += target.worth;
		this.waveManager.monsterManager.handleDeath(target);
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

	if(!this.player.alive) return;

		var moving = false;
		this.player.torso.rotation = this.game.physics.arcade.angleToPointer(this.player.torso) + (Math.PI / 2);
		this.player.legs.rotation = this.player.torso.rotation;

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			this.player.torso.body.velocity.y = -this.player.speed;
			this.player.legs.rotation = Phaser.Math.degToRad(180);
			moving = true;
		} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			this.player.torso.body.velocity.y = this.player.speed;
			this.player.legs.rotation = Phaser.Math.degToRad(0);
			moving = true;
		} else {
			this.player.torso.body.velocity.y = 0;
		}

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
			this.player.torso.body.velocity.x = -this.player.speed;
			this.player.legs.rotation = Phaser.Math.degToRad(270);
			moving = true;
		} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
			this.player.torso.body.velocity.x = this.player.speed;
			this.player.legs.rotation = Phaser.Math.degToRad(90);
			moving = true;
		} else {
			this.player.torso.body.velocity.x = 0;
		}

		if (moving) {
			this.player.legs.animations.play('walk', 4, true);
		} else {
			this.player.legs.animations.stop('walk');
		}
};

Doomsday.Main.prototype.onSelectWeapon = function(e, weaponIndex) {
	this.player.selectWeapon(weaponIndex);
};


Doomsday.Main.prototype.formatTime = function(s) {
	// Convert seconds (s) to a nicely formatted and padded time string
	s = Math.round(s);
	var minutes = "0" + Math.floor(s / 60);
	var seconds = "0" + (s - minutes * 60);
	return minutes.substr(-2) + ":" + seconds.substr(-2);
};

Doomsday.Main.prototype.handlePlayerDeath = function() {
	var data = {
		name: this.game.playerName,
		time: Date.now(),
		score: this.game.score,
		elapsedTime: this.game.elapsedTime,
		wave: this.waveManager.currentWave
	};

	this.game.saveHighscore(data);

	//this.game.save('doomsday');
	//console.table(this.game.highscores);
	this.game.camera.fade("#000", 1000)
		this.game.camera.onFadeComplete.addOnce(function() {
			this.game.state.start('GameOver');
		}, this);
};