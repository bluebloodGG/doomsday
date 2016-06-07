/* global Phaser Doomsday */
Doomsday.Hud = (function() {
	function Hud(game, player) {
		Phaser.Group.call(this, game);

		this.game = game;
		this.player = player;

		this.font = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1);
		this.test = this.game.add.image(200,200, this.font);
		this.test.fixedToCamera = true;
	}

	Hud.prototype = Object.create(Phaser.Group.prototype);
	Hud.prototype.constructor = Hud;

	Hud.prototype.update = function() {
		this.font.text = "TEST";
	};

	return Hud;
}());