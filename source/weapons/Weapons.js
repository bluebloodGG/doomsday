/* global Phaser Doomsday */
Doomsday.Weapons = (function() {
	var Weapons = {};

	Weapons.Pistol = function(game, parent) {
		Phaser.Sprite.call(this, game, 0,0, 'weapons', '1h_pistol.png');

		this.anchor.set(0.5);
		this.nextFire = 0;
		this.bulletSpeed = 600;
		this.fireRate = 100;
		this.bullets = this.game.add.group(this, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

		for(var i = 0; i < 64; i++) {
			this.bullets.add(new Doomsday.Bullet(game, 'bullet'), true);
		}

		this.game.add.sprite(this);

		return this;
	};

	Weapons.Pistol.prototype = Object.create(Phaser.Sprite.prototype);
	Weapons.Pistol.prototype.constructor = Weapons.Pistol;

	Weapons.Pistol.prototype.fire = function(source, angle) {
		if(this.game.time.time < this.nextFire) { return; }

		// rotate exit point
		var bwp = new Phaser.Point(source.x + 2, source.y - 24);
		bwp.rotate(source.x, source.y, angle, true);
		var x = bwp.x;
		var y = bwp.y;
		this.bullets.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);
		this.nextFire = this.game.time.time + this.fireRate;
	}

	return Weapons;
}());