/* global Phaser */
var MonsterManager = (function() {

	function MonsterManager(game, player) {
		this.game = game;
		this.player = player;
		this.monsters = this.game.add.group();
		this.corpses = this.game.add.group();

	}

	MonsterManager.prototype.update = function() {
		this.monsters.forEachAlive(function(monster) {
			if(monster.visible && monster.inCamera) {
				this.game.physics.moveToObject(monster, this.player,
					monster.speed);
				monster.animations.play('move');
			}
		}, this);

		this.monsters.forEachDead(function(monster) {
			this.handleDeath(monster);
			this.generateMonster();
		}, this);
	};

	MonsterManager.prototype.setStats = function(monster, name, health, speed, strength) {
		monster.animations.play('move');

		monster.body.collideWorldBounds = true;
		monster.body.velocity.setTo(0, 0);
		monster.alive = true;

		monster.name = name;
		monster.health = health;
		monster.speed = speed;
		monster.strength = strength;

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
		var monster = this.monsters.create(this.game.world.randomX,
		this.game.world.randomY, '');

		do {
			monster.reset(this.game.world.randomX,
							this.game.world.randomY);
		} while(Phaser.Math.distance(this.player.x, this.player.y,
			monster.x, monster.y) <= 400);

		monster = this.generateZombie(monster);
	};

	MonsterManager.prototype.generateZombie = function(monster) {

		monster.animations.add('walk', Phaser.Animation.generateFrameNames('zombie_move_000', 1, 4)),
		monster.animations.add('attack', Phaser.Animation.generateFrameNames('zombie_attack_000', 1, 2)),
		monster.animations.add('spawn', Phaser.Animation.generateFrameNames('zombie_spawn_000', 1, 2)),
		monster.animations.add('guts', Phaser.Animation.generateFrameNames('zombie_guts_000', 1, 3))

		return this.setStats(monster, 'Zombie', 100, 200)
	};

	MonsterManager.prototype.handleDeath = function(target) {
		var corpse = this.corpses.create(target.x, target.y, '');
		corpse.lifetime = 3000;
		target.destroy();
	};

	return MonsterManager;

}());