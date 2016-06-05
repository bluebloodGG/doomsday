/* global Phaser */
var Submachinegun = (function() {
	function Submachinegun(game, parent) {
		this.game = game;
		this.parent = parent;

		this.sprite = new Phaser.Sprite(this.game, 2, -28, 'weapons', '1h_smg.png');
		this.sprite.anchor.setTo(0.5, 0.5);

		this.currentRateOfFire = 25;
		this.fireRate = 50;
		this.nextFire = 0;
		this.isShooting = false;
		this.strength = 15;

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

	Submachinegun.prototype.fire = function() {
		if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
		{
			var bulletWorldPosition = new Phaser.Point(this.sprite.parent.x+2, this.sprite.parent.y-44);
			bulletWorldPosition.rotate(this.sprite.parent.x, this.sprite.parent.y, this.sprite.parent.rotation);
			this.nextFire = this.game.time.now + (1000/this.currentRateOfFire);

			var bullet = this.bullets.getFirstExists(false);
			bullet.reset(bulletWorldPosition.x, bulletWorldPosition.y);

			var spread = 3.0;
			var angle = this.sprite.parent.angle-90 + (spread * (this.game.rnd.integerInRange(-4, 4)));

			this.game.physics.arcade.velocityFromAngle(angle, 2000, bullet.body.velocity);


			bullet.angle = angle;
			//bullet.angle = this.sprite.parent.angle-90;


			return true;
		}

		return false;
	};

	Submachinegun.prototype.equip = function() {
		this.parent.addChild(this.sprite);
	};

	Submachinegun.prototype.unequip = function() {
	  this.parent.removeChild(this.sprite);
	};

	return Submachinegun;
}());