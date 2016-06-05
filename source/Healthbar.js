/* global Phaser */
Doomsday.Healthbar = (function () {

	function Healthbar(game, target) {
		this.game = game;
		this.target = target;

		this.target.events.onDestroy.add(this.onDestroy, this)

		var bmd = this.game.add.bitmapData(64, 10);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, 64, 10);
		bmd.ctx.fillStyle = '#00685E';
		//bmd.ctx.fill();

		var startx = this.target.world.x;
		var starty = this.target.world.y+32;
		this.bglife = this.game.add.sprite(startx, starty, bmd);
		this.bglife.anchor.setTo(0.5, 0.5);

		bmd = this.game.add.bitmapData(58, 4);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, 58, 4);
		bmd.ctx.fillStyle = '#00F910';
		bmd.ctx.fill();

		this.widthLife = new Phaser.Rectangle(0, 0, bmd.width, bmd.height);
		this.totalLife = bmd.width;

		this.life = this.game.add.sprite(startx - this.bglife.width / 2 + 3, starty, bmd);
		this.life.anchor.y = 0.5;
		this.life.cropEnabled = true;
		this.life.crop(this.widthLife);

	};

	Healthbar.prototype.update = function () {

		this.bglife.position.setTo(this.target.world.x, this.target.world.y + 32);
		this.life.position.setTo(this.target.world.x - this.bglife.width / 2 + 3, this.target.world.y + 32);

		this.life.width = this.totalLife * (this.target.health / this.target.maxHealth);
		this.life.updateCrop();
	};

	Healthbar.prototype.render = function () {
	};

	Healthbar.prototype.cropLife = function () {
		if (this.widthLife.width <= 0) {
			this.widthLife.width = this.totalLife;
		}
		else {
			this.game.add.tween(this.widthLife).to({ width: (this.widthLife.width - (this.totalLife / 10)) }, 200, Phaser.Easing.Linear.None, true);
		}
	};

	Healthbar.prototype.onDestroy = function (sprite) {
		this.target.destroy();
		this.life.destroy();
		this.bglife.destroy();
	};

	return Healthbar;

} ());