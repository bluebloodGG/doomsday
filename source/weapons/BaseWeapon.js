/* Global Phaser Doomsday */
Doomsday.BaseWeapon = (function () {
	function BaseWeapon(game, parent, sprite, stats) {
		this.game = game;
		this.parent = parent;

		this.currentRateOfFire = stats.currentRateOfFire;
		this.fireRate = stats.fireRate;
		this.nextFire = 0;
		this.isShooting = false;
		this.strength = 30;
		this.clipSize = 12;
		this.currentAmmo = this.clipSize;
		this.reloadTime = 1500;
		this.reloading = false;

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(300, 'bullet', 0, false);
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('checkWorldBounds', true);
		this.bullets.setAll('strength', this.strength, false, false, 0, true);

		this.sprite = this.parent.addChild(sprite);
		this.sprite.anchor.setTo(0.5, 0.5);
	}

	BaseWeapon.prototype.fire = function () {
		if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0 && this.currentAmmo > 0) {
			var bulletWorldPosition = new Phaser.Point(this.parent.x + 2, this.parent.y - 44);
			bulletWorldPosition.rotate(this.parent.x, this.parent.y, this.parent.rotation);
			this.nextFire = this.game.time.now + (1000 / this.currentRateOfFire);

			var bullet = this.bullets.getFirstExists(false);
			bullet.reset(bulletWorldPosition.x, bulletWorldPosition.y);
			this.game.physics.arcade.velocityFromAngle(this.parent.angle - 90, 1000, bullet.body.velocity);
			bullet.angle = this.parent.angle - 90;

			// var gf = this.gunflash;
			// gf.visible = true;
			// if (!this.anim.gunflash.isPlaying) {
			// 	this.anim.gunflash.play(48, false).onComplete.add(function () {
			// 		gf.visible = false;
			// 	});
			// }

			return true;
		}

		return false;
	};

	BaseWeapon.prototype.reload = function () {
		if (!this.reloading) {
			this.reloading = true;
			this.game.time.events.add(this.reloadTime, function () {
				this.currentAmmo = this.clipSize;
				this.reloading = false;
			}, this);
		}
	};

	return BaseWeapon;
} ());