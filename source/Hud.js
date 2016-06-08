/* global Phaser Doomsday */
Doomsday.Hud = (function() {
	function Hud(game, player) {
		Phaser.Group.call(this, game);

		this.game = game;
		this.player = player;

		this.font = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1);
		this.test = this.game.add.image(64,this.game.camera.height-32, this.font);
		this.test.fixedToCamera = true;
	}

	Hud.prototype = Object.create(Phaser.Group.prototype);
	Hud.prototype.constructor = Hud;

	Hud.prototype.update = function() {

		this.font.text = "Health: " + this.player.health + "/" + this.player.maxHealth
		+ " Ammo: " + this.player.weaponManager.selectedWeapon.currentAmmo + "/" + this.player.weaponManager.selectedWeapon.clipSize;
	};

	return Hud;
}());