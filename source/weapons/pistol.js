/* global Phaser */
var Pistol = (function() {
	function Pistol(game, parent) {
		this.game = game;
		this.parent = parent;

		this.sprite = new Phaser.Sprite(this.game, 2, -28, 'weapons', '1h_pistol.png');
		this.sprite.anchor.setTo(0.5, 0.5);

		this.gunflash = new Phaser.Sprite(this.game, 0, -14, 'gunflash', 'flash_b_0001');
		this.gunflash.anchor.setTo(0.5, 0.5);
		this.gunflash.scale.setTo(0.1, 0.1);
		this.gunflash.visible = false;
		this.sprite.addChild(this.gunflash);
		this.anim = {
			gunflash: this.gunflash.animations.add('gunflash', Phaser.Animation.generateFrameNames('flash_b_000', 1, 6))
		}

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(300, 'bullet', 0, false);
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('checkWorldBounds', true);

		this.currentRateOfFire = 5;
		this.fireRate = 50;
		this.nextFire = 0;
		this.isShooting = false;
		this.damage = 3;
	}

	Pistol.prototype.fire = function() {
		if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
		{
			var bulletWorldPosition = new Phaser.Point(this.sprite.parent.x+2, this.sprite.parent.y-44);
			bulletWorldPosition.rotate(this.sprite.parent.x, this.sprite.parent.y, this.sprite.parent.rotation);
			this.nextFire = this.game.time.now + (1000/this.currentRateOfFire);

			var bullet = this.bullets.getFirstExists(false);
			bullet.reset(bulletWorldPosition.x, bulletWorldPosition.y);
			this.game.physics.arcade.velocityFromAngle(this.sprite.parent.angle-90, 1000, bullet.body.velocity);
			bullet.angle = this.sprite.parent.angle-90;

			var gf = this.gunflash;
			gf.visible = true;
			if(!this.anim.gunflash.isPlaying) {
				this.anim.gunflash.play(48, false).onComplete.add(function() {
					gf.visible = false;
				});
			}

			return true;
		}

		return false;
	};

	Pistol.prototype.equip = function() {
		this.parent.addChild(this.sprite);
	};

	Pistol.prototype.unequip = function() {
	  this.parent.removeChild(this.sprite);
	};

	return Pistol;
}());