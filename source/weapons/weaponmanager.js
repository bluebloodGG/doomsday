/* global Phaser Doomsday */
Doomsday.WeaponManager = (function() {
	function WeaponManager(game, player) {
		this.weapons = [];
	}

	WeaponManager.prototype.createWeapon = function(name) {
		var weapon = new Doomsday.BaseWeapon();
		this.weapons[name] = weapon;
		return weapon;
	}
	return WeaponManager;
}());