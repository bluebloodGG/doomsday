/* global Phaser */
Doomsday.MonsterManager = (function() {

	function MonsterManager(game, player) {
		this.game = game;
		this.player = player;
		this.monsters = this.game.add.group();
		this.corpses = this.game.add.group();
		this.blood = this.game.add.group();

	}

	MonsterManager.prototype.update = function() {
		this.monsters.forEachAlive(function(monster) {
			if(monster.visible && monster.inCamera && !monster.spawning) {
				var rotation = this.game.physics.arcade.moveToObject(monster, this.player, monster.speed);
				monster.rotation = rotation -  (Math.PI / 2);
				monster.animations.play('move');
				monster.healthbar.update();
			}
		}, this);

		this.monsters.forEachDead(function(monster) {
			this.handleDeath(monster);
			this.generateMonster();
		}, this);
	};

	MonsterManager.prototype.render = function() {
		this.monsters.forEachAlive(function(monster) {
			monster.healthbar.render();
		}, this);
	}

	MonsterManager.prototype.setStats = function(monster, name, health, speed, strength, corpseFrames) {
		monster.animations.play('spawn').onComplete.add(function() {
			monster.spawning = false;
		});

		monster.body.collideWorldBounds = true;
		monster.body.velocity.setTo(0, 0);
		monster.alive = true;

		monster.name = name;
		monster.health = health;
		monster.maxHealth = health;
		monster.speed = speed;
		monster.strength = strength;
		monster.spawning = true;
		monster.corpseFrames = corpseFrames;
		monster.healthbar = new Doomsday.Healthbar(this.game, monster);

		return monster;
	};

	MonsterManager.prototype.generateMonsters = function(amount){
		this.monsters.enableBody = true;
		this.monsters.physicsBodyType = Phaser.Physics.ARCADE;

		for(var i = 0; i < amount; i++) {
			this.generateMonster();
		}
	};

	MonsterManager.prototype.generateMonster = function() {
		var monster = this.monsters.create(this.game.world.randomX, this.game.world.randomY, 'zombiearmy');
		monster.anchor.setTo(0.5, 0.5);


		do {
			monster.reset(this.game.world.randomX, this.game.world.randomY);
		} while(Phaser.Math.distance(this.player.x, this.player.y, monster.x, monster.y) <= 200);

		var rnd = Math.random();

		if(rnd >= 0 && rnd < .5) monster = this.generateCrow(monster);
		else if(rnd >= .5 && rnd < .6) monster = this.generateFatso(monster);
		else if(rnd >= .6 && rnd < .7) monster = this.generateMoose(monster);
		else if(rnd >= .7 && rnd < .8) monster = this.generateRott(monster);
		else if(rnd >= .8 && rnd < .9) msonster = this.generateVomit(monster);
		else if(rnd >= .9 && rnd < 1) monster = this.generateZombie(monster);
		return monster;
	};

	MonsterManager.prototype.generateCrow = function(monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('crow/move/crow_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('crow/attack/crow_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('crow/attack/crow_attack_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'crow', 25, 200, 10, Phaser.Animation.generateFrameNames('crow/guts/crow_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateFatso = function(monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('fatso/move/fatso_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('fatso/attack/fatso_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('fatso/spawn/fatso_spawn_000', 1, 2, '.png'), 2);

		monster.scale.setTo(2.0, 2.0);
		return this.setStats(monster, 'fatso', 250, 50, 10, Phaser.Animation.generateFrameNames('fatso/guts/fatso_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateMoose = function(monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('moose/move/moose_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('moose/attack/moose_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('moose/spawn/moose_spawn_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'moose', 75, 150, 10, Phaser.Animation.generateFrameNames('moose/guts/moose_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateRott = function(monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('rott/move/rott_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('rott/attack/rott_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('rott/spawn/rott_spawn_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'rott', 100, 100, 10, Phaser.Animation.generateFrameNames('rott/guts/rott_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateVomit = function(monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('vomit/move/vomit_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('vomit/attack/vomit_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('vomit/spawn/vomit_spawn_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'vomit', 150, 125, 10, Phaser.Animation.generateFrameNames('vomit/guts/vomit_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.generateZombie = function(monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('zombie/move/zombie_move_000', 1, 4, '.png'), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('zombie/attack/zombie_attack_000', 1, 2, '.png'), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('zombie/spawn/zombie_spawn_000', 1, 2, '.png'), 2);

		return this.setStats(monster, 'zombie', 100, 100, 10, Phaser.Animation.generateFrameNames('zombie/guts/zombie_guts_000', 1, 3, '.png'));
	};

	MonsterManager.prototype.handleDeath = function(target) {

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

		target.destroy();
		delete target.healthbar;
	};

	return MonsterManager;

}());