/* global Phaser */
Doomsday.MonsterManager = (function () {

	function MonsterManager(game, player, parent, spawners) {
		this.game = game;
		this.player = player;
		this.spawners = spawners;
		this.corpses = this.game.add.group(parent, 'Corpses');
		this.blood = this.game.add.group(parent, 'Blood');
		this.monsters = this.game.add.group(parent, 'Monsters');
		this.gameOver = false;
		this.monstersAlive = 0;

		this.stats = {
			crow: { spawn: .30, health: 50, speed: 400, strength: 2, worth: 10 },
			moose: { spawn: .55, health: 75, speed: 250, strength: 4, worth: 25 },
			zombie: { spawn: .75, health: 100, speed: 200, strength: 6, worth: 50 },
			vomit: { spawn: .88, health: 150, speed: 175, strength: 8, worth: 75 },
			rott: { spawn: .95, health: 100, speed: 250, strength: 10, worth: 100 },
			fatso: { spawn: 1, health: 250, speed: 150, strength: 20, worth: 200 }
		}
	}

	MonsterManager.prototype.destroyThemAll = function () {

		var i = 0;
		this.monsters.forEachAlive(function (monster) {
			this.handleDeath(monster);
			i++;
		}, this);
		console.log("killed", i);
	};

	MonsterManager.prototype.update = function () {
		this.monstersAlive = 0;
		if (this.gameOver) return;

		this.monsters.forEachAlive(function (monster) {
			if (/*monster.visible && monster.inCamera && */!monster.spawning) {
				var rotation = this.game.physics.arcade.moveToObject(monster, this.player, monster.speed);
				monster.rotation = rotation - (Math.PI / 2);
				monster.animations.play('move');
				//monster.healthbar.update();
			}
			this.monstersAlive++;
		}, this);

		//  this.monsters.forEachDead(function (monster) {
		//  	this.handleDeath(monster);
		//  	//this.generateMonster();
		//  }, this);

		if (!this.player.alive) {
			this.destroyThemAll();

			this.gameOver = true;
		}
	};

	MonsterManager.prototype.render = function () {
		// this.monsters.forEach(function(monster) {
		// 	this.game.debug.body(monster);
		// }, this);
		// this.monsters.forEachAlive(function (monster) {
		// 	//monster.healthbar.render();
		// }, this);
	}

	MonsterManager.prototype.setStats = function (monster, name, stats, corpseFrames) {
		monster.animations.play('spawn').onComplete.add(function () {
			monster.spawning = false;
		});

		monster.body.collideWorldBounds = true;
		monster.body.velocity.setTo(0, 0);
		monster.alive = true;

		monster.name = name;
		monster.health = stats.health;
		monster.maxHealth = stats.health;
		monster.speed = stats.speed;
		monster.strength = stats.strength;
		monster.spawning = true;
		monster.corpseFrames = corpseFrames;
		monster.worth = stats.worth;
		monster.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
		var scale = Math.max(monster.maxHealth / 100, 1.5);
		monster.scale.set(scale);
		//monster.healthbar = new Doomsday.Healthbar(this.game, monster);

		return monster;
	};

	MonsterManager.prototype.generateMonsters = function (amount, wave) {
		this.monsters.enableBody = true;
		this.monsters.physicsBodyType = Phaser.Physics.ARCADE;

		amount  = (amount + wave) * Math.pow(wave, 1/4);

		for (var i = 0; i < amount; i++) {
			this.generateMonster();
		}
	};

	MonsterManager.prototype.generateMonster = function () {
		var monster = this.monsters.getFirstDead();
		if(monster == null)
			monster = this.monsters.create(this.game.world.randomX, this.game.world.randomY, 'zombiearmy');

		monster.anchor.setTo(0.5, 0.5);

		var idx = this.game.rnd.between(0, this.spawners.length - 1);
		var spawner = this.spawners[idx];
		var startX = this.game.rnd.between(spawner.x, spawner.x + spawner.width);
		var startY = this.game.rnd.between(spawner.y, spawner.y + spawner.height);
		monster.reset(startX, startY);
		// do {
		// 	monster.reset(this.game.world.randomX, this.game.world.randomY);
		// } while(Phaser.Math.distance(this.player.x, this.player.y, monster.x, monster.y) <= 200);

		var rnd = Math.random();

		if (rnd >= 0 && rnd < this.stats.crow.spawn) monster = this.generateCrow(monster);
		else if (rnd >= this.stats.crow.spawn && rnd < this.stats.moose.spawn) monster = this.generateMoose(monster);
		else if (rnd >= this.stats.moose.spawn && rnd < this.stats.zombie.spawn) monster = this.generateZombie(monster);
		else if (rnd >= this.stats.zombie.spawn && rnd < this.stats.vomit.spawn) monster = this.generateVomit(monster);
		else if (rnd >= this.stats.vomit.spawn && rnd < this.stats.rott.spawn) monster = this.generateRott(monster);
		else if (rnd >= this.stats.rott.spawn && rnd < this.stats.fatso.spawn) monster = this.generateFatso(monster);
		return monster;
	};

	MonsterManager.prototype.generateCrow = function (monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('crow/move/crow_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('crow/attack/crow_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('crow/attack/crow_attack_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'crow', this.stats.crow, Phaser.Animation.generateFrameNames('crow/guts/crow_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateFatso = function (monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('fatso/move/fatso_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('fatso/attack/fatso_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('fatso/spawn/fatso_spawn_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'fatso', this.stats.fatso, Phaser.Animation.generateFrameNames('fatso/guts/fatso_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateMoose = function (monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('moose/move/moose_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('moose/attack/moose_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('moose/spawn/moose_spawn_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'moose', this.stats.moose, Phaser.Animation.generateFrameNames('moose/guts/moose_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateRott = function (monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('rott/move/rott_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('rott/attack/rott_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('rott/spawn/rott_spawn_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'rott', this.stats.rott, Phaser.Animation.generateFrameNames('rott/guts/rott_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateVomit = function (monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('vomit/move/vomit_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('vomit/attack/vomit_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('vomit/spawn/vomit_spawn_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'vomit', this.stats.vomit, Phaser.Animation.generateFrameNames('vomit/guts/vomit_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateZombie = function (monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('zombie/move/zombie_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('zombie/attack/zombie_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('zombie/spawn/zombie_spawn_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'zombie', this.stats.zombie, Phaser.Animation.generateFrameNames('zombie/guts/zombie_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.handleDeath = function (target) {

		var blood = this.blood.create(target.x, target.y, 'blood');
		blood.animations.add('blood1', Phaser.Animation.generateFrameNames('blood_a_000', 1, 6));
		blood.anchor.setTo(0.5, 0.5);
		blood.scale.setTo(target.maxHealth / 500, target.maxHealth / 500);
		blood.play('blood1', 24);
		blood.rotation = target.rotation - (Math.PI / 2);;
		blood.lifespan = 4000;

		var corpse = this.corpses.create(target.x, target.y, 'zombiearmy');
		corpse.animations.add('guts', target.corpseFrames, 3);
		corpse.anchor.setTo(0.5, 0.5);
		corpse.play('guts', 12);
		corpse.rotation = target.rotation - (Math.PI / 2);
		corpse.lifespan = 3000;
		corpse.scale = target.scale;

		target.kill();
		//target.healthbar.onDestroy();
	};

	return MonsterManager;

} ());