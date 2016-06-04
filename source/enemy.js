/* global Phaser */
var Enemy = (function() {
	function Enemy(game, player, startX, startY) {
		this.game = game;
		this.player = player;

		this.sprite = this.game.add.sprite(startX || this.game.world.randomX, startY || this.game.world.randomY, 'zombie', 'zombie_move_0001');
		this.sprite.anchor.setTo(0.5, 0.5);
		this.anim = {
			walk: this.sprite.animations.add('walk', Phaser.Animation.generateFrameNames('zombie_move_000', 1, 4)),
			attack: this.sprite.animations.add('attack', Phaser.Animation.generateFrameNames('zombie_attack_000', 1, 2)),
			spawn: this.sprite.animations.add('spawn', Phaser.Animation.generateFrameNames('zombie_spawn_000', 1, 2)),
			guts: this.sprite.animations.add('guts', Phaser.Animation.generateFrameNames('zombie_guts_000', 1, 3))
		};

		this.game.physics.arcade.enable(this.sprite);

		this.anim.walk.play(4, true);

		this.states = {
			WALKING: "walking",
			ATTACKING: "attacking",
			DEAD: "dead"
		}

		this.state = this.states.WALKING;
		this.previousState = this.state;
		this.health = 10.0;
		var style = { font: "bold 12px Arial"};
		this.healthText = this.game.add.text(this.sprite.world.x, this.sprite.world.y, this.health, style);
		this.healthText.anchor.setTo(0.5, 0.5);

	}

	Enemy.prototype.update = function() {

		var distanceToPlayer = this.game.physics.arcade.distanceBetween(this.sprite, this.player.soldier.torso);
		this.previousState = this.state;
		if (distanceToPlayer < 100) {
			this.state = this.states.ATTACKING;
		}
		else {
			this.state = this.states.WALKING;
		}

		if (!this.sprite.alive) {
			this.state = this.states.DEAD;
			this.sprite.body.velocity.setTo(0, 0);
		}

		if (this.state !== this.previousState) {
			switch (this.state) {
				case this.states.WALKING:
					this.anim.walk.play(2, true);
					break;
				case this.states.ATTACKING:
					this.anim.attack.play(2, true);
					break;
				case this.states.DEAD:
					this.anim.guts.play(12, false);
					break;
			}
		}


		if (this.sprite.alive)
			this.sprite.rotation = this.game.physics.arcade.moveToXY(this.sprite, this.player.soldier.torso.x, this.player.soldier.torso.y, 90) - (Math.PI / 2);

		this.healthText.x = this.sprite.world.x;
		this.healthText.y = this.sprite.world.y+48;
		this.healthText.text = this.health > 0 ? this.health : "";
	};

	Enemy.prototype.onHit = function(damage) {
		this.health -= damage;


			var blood = this.game.add.sprite(this.sprite.world.x, this.sprite.world.y, 'blood', 'blood_a_0001');
			blood.anchor.setTo(0.5, 0.5);
			blood.scale.setTo(0.25, 0.25);
			blood.rotation = this.sprite.rotation;
			this.sprite.bringToTop();
			blood.animations.add('blood1', Phaser.Animation.generateFrameNames('blood_a_000', 1, 6)).play(24, false).onComplete.add(function() {
				this.game.time.events.add(Phaser.Timer.SECOND * 4, function() {
					blood.destroy();
				}, this);
			});
			//this.sprite.animations.add('blood2', Phaser.Animation.generateFrameNames('blood_b_000', 1, 6))
			//this.anim.blood1.play(6, false);

		if(this.health <= 0) {
			this.sprite.alive = false;
			this.game.time.events.add(Phaser.Timer.SECOND * 4, function() {
				this.sprite.destroy();
				console.log("hej");
			}, this);
		}
	};

	return Enemy;
}());