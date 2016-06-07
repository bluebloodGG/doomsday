/* Global Phaser Doomsday */
Doomsday.BaseWeapon = (function() {
	function BaseWeapon(game) {
		this.game = game;

		this.currentRateOfFire = 5;
		this.fireRate = 50;
		this.nextFire = 0;
		this.isShooting = false;
		this.strength = 30;
		this.clipSize = 12;
		this.currentAmmo = this.clipSize;
		this.reloadTime = 1500;

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(300, 'bullet', 0, false);
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('checkWorldBounds', true);
		this.bullets.setAll('strength', this.strength, false, false, 0, true);
	}

	BaseWeapon.prototype.fire = function() {
		if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0 /*&& this.currentAmmo > 0*/)
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

	return BaseWeapon;
}());