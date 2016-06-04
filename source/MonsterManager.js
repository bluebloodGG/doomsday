/* global Phaser */
var MonsterManager = (function() {

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
			}
		}, this);

		this.monsters.forEachDead(function(monster) {
			this.handleDeath(monster);
			this.generateMonster();
		}, this);
	};

	MonsterManager.prototype.setStats = function(monster, name, health, speed, strength) {
		monster.animations.play('spawn').onComplete.add(function() {
			monster.spawning = false;
		});	

		monster.body.collideWorldBounds = true;
		monster.body.velocity.setTo(0, 0);
		monster.alive = true;

		monster.name = name;
		monster.health = health;
		monster.speed = speed;
		monster.strength = strength;
		monster.spawning = true;

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
		var monster = this.monsters.create(this.game.world.randomX, this.game.world.randomY, 'zombie');
		monster.anchor.setTo(0.5, 0.5);
		

		do {
			monster.reset(this.game.world.randomX, this.game.world.randomY);
		} while(Phaser.Math.distance(this.player.x, this.player.y, monster.x, monster.y) <= 200);

		monster = this.generateZombie(monster);
	};

	MonsterManager.prototype.generateZombie = function(monster) {

		monster.animations.add('move', Phaser.Animation.generateFrameNames('zombie_move_000', 1, 4), 4);
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('zombie_attack_000', 1, 2), 2);
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('zombie_spawn_000', 1, 2), 2);		

		return this.setStats(monster, 'Zombie', 100, 200)
	};

	MonsterManager.prototype.handleDeath = function(target) {
		debugger;
		var blood = this.blood.create(target.x, target.y, 'blood');
		blood.animations.add('blood1', Phaser.Animation.generateFrameNames('blood_a_000', 1, 6));
		blood.anchor.setTo(0.5, 0.5);
		blood.scale.setTo(0.25, 0.25);
		blood.play('blood1', 24);
		blood.rotation = target.rotation - (Math.PI / 2);;
		blood.lifespan = 4000;
		
		var corpse = this.corpses.create(target.x, target.y, 'zombie');		
		corpse.animations.add('guts', Phaser.Animation.generateFrameNames('zombie_guts_000', 1, 3), 3);
		corpse.anchor.setTo(0.5, 0.5);
		corpse.play('guts', 12);
		corpse.rotation = target.rotation - (Math.PI / 2);
		corpse.lifespan = 3000;
		
		target.destroy();
	};

	return MonsterManager;

}());