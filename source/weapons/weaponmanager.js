/* global Phaser Doomsday */
Doomsday.WeaponManager = (function () {
	function WeaponManager(game, player) {
		this.game = game;
		this.player = player;
		this.weapons = [];

		this.createWeapon('pistol',
			new Phaser.Sprite(this.game, 2, -28, 'weapons', '1h_pistol.png'), {
				fireRate: 25,
				currentRateOfFire: 5
			});

		this.createWeapon('smg',
			new Phaser.Sprite(this.game, 2, -28, 'weapons', '1h_smg.png'), {
				fireRate: 25,
				currentRateOfFire: 25
			});

		this.selectedWeapon = this.weapons['pistol'];
	}

	WeaponManager.prototype.createWeapon = function (name, sprite, stats) {
		var weapon = new Doomsday.BaseWeapon(this.game, this.player.torso, sprite, stats);
		this.weapons[name] = weapon;
		weapon.sprite.kill();
		return weapon;
	};

	WeaponManager.prototype.fire = function () {
		this.selectedWeapon.fire();
	};

	WeaponManager.prototype.selectWeapon = function (name) {
		this.selectedWeapon.sprite.kill();
		this.selectedWeapon = this.weapons[name];
		this.selectedWeapon.sprite.revive();
	};

	return WeaponManager;
} ());