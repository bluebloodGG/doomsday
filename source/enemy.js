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
			spawn: this.sprite.animations.add('spawn', Phaser.Animation.generateFrameNames('zombie_spawn_000', 1, 2))
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
	}

	Enemy.prototype.update = function() {
		
		var distanceToPlayer = this.game.physics.arcade.distanceBetween(this.sprite, this.player.soldier.torso);
		this.previousState = this.state;
		if(distanceToPlayer < 100) {
			this.state = this.states.ATTACKING;
		} else {
			this.state = this.states.WALKING;
		}
		
		if(!this.sprite.alive) {
			this.state = this.states.DEAD;
			this.sprite.body.velocity.setTo(0, 0);
		}
		
		if(this.state !== this.previousState) {
			switch(this.state) {
				case this.states.WALKING:
					this.anim.walk.play(2, true);
				break;
				case this.states.ATTACKING:
					this.anim.attack.play(2, true);
				break;
				case this.states.DEAD:
					this.anim.spawn.play(2, false);
				break;
			}
		}
		
		
		if(this.sprite.alive)
			this.sprite.rotation = this.game.physics.arcade.moveToXY(this.sprite, this.player.soldier.torso.x, this.player.soldier.torso.y, 90) - (Math.PI / 2);
		
		
		
	};

	return Enemy;
}());