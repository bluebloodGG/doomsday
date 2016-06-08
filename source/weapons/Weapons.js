/* global Phaser Doomsday */
Doomsday.Weapons = (function() {
	var Weapons = {};

	// ================================
	// ============ PISTOL ============
	// ================================
	Weapons.Pistol = function(game, parent) {
		this.game = game;
		this.parent = parent;
		this.nextFire = 0;
		this.bulletSpeed = 600;
		this.fireRate = 500;
		this.damage = 30;
		this.bullets = this.game.add.group(this.game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

		for(var i = 0; i < 64; i++) {
			this.bullets.add(new Doomsday.Bullet(game, 'bullet', this.damage), true);
		}

		this.weapon = parent.torso.addChild(new Phaser.Sprite(this.game, 2, -28, 'weapons', '1h_pistol.png'));
		this.weapon.anchor.set(0.5);
		this.weapon.name = "Pistol";

		return this;
	};

	Weapons.Pistol.prototype.fire = function(source, angle) {
		if(this.game.time.time < this.nextFire) { return; }

		// rotate exit point
		var bwp = new Phaser.Point(source.x + 1, source.y - 44);
		bwp.rotate(source.x, source.y, angle, true);
		var x = bwp.x;
		var y = bwp.y;
		this.bullets.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);
		this.nextFire = this.game.time.time + this.fireRate;
	}

	// ================================
	// ============ SMG ===============
	// ================================
	Weapons.SMG = function(game, parent) {
		this.game = game;
		this.parent = parent;
		this.nextFire = 0;
		this.bulletSpeed = 750;
		this.fireRate = 100;
		this.damage = 30;
		this.bullets = this.game.add.group(this.game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

		for(var i = 0; i < 64; i++) {
			this.bullets.add(new Doomsday.Bullet(game, 'bullet', this.damage), true);
		}

		this.weapon = parent.torso.addChild(new Phaser.Sprite(this.game, 2, -28, 'weapons', '1h_smg.png'));
		this.weapon.anchor.set(0.5);
		this.weapon.name = "SMG";

		return this;
	};

	Weapons.SMG.prototype.fire = function(source, angle) {
		if(this.game.time.time < this.nextFire) { return; }

		// rotate exit point
		var bwp = new Phaser.Point(source.x + 1, source.y - 44);
		bwp.rotate(source.x, source.y, angle, true);
		var x = bwp.x;
		var y = bwp.y;
		this.bullets.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);
		this.nextFire = this.game.time.time + this.fireRate;
	}

	return Weapons;
}());