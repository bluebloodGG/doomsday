/* global Phaser Doomsday */
Doomsday.Player = (function () {
	function Player(game, parent) {
		Phaser.Group.call(this, game, parent, 'Player', false, true, Phaser.Physics.ARCADE)
		this.game = game;

		this.enableBody = true;
		this.physicsBodyType = Phaser.Physics.ARCADE;

		var startX = this.game.world.centerX;
		var startY = this.game.world.centerY;
		this.legs = new Phaser.Sprite(this.game, startX, startY, 'soldier', 'soldier_legs_0001.png');
		this.torso = new Phaser.Sprite(this.game, startX, startY, 'soldier', 'soldier_torso_1h.png');

		this.add(this.legs);
		this.add(this.torso);
		this.corpse = this.game.add.sprite(0, 0, 'zombiearmy', '');
		this.corpse.animations.add('splat', Phaser.Animation.generateFrameNames('splatter_1/splatter_1_000', 1, 7, '.png'))
		this.corpse.visible = false;
		this.corpse.anchor.set(0.5);
		this.corpse.scale.set(2);
		this.corpse.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

		//this.game.physics.arcade.enable(this.torso);
		this.torso.anchor.set(0.5);
		this.torso.body.checkWorldBounds = true;
		this.legs.anchor.set(0.5);
		this.legs.animations.add('walk', Phaser.Animation.generateFrameNames('soldier_legs_000', 1, 4, '.png'));

		this.game.camera.follow(this.torso);
		this.speed = 350;
		this.health = 100;
		this.maxHealth = this.health;

		this.weapons = [];
		this.currentWeapon = 0;
		this.weaponName = null;

		this.weapons.push(new Doomsday.Weapons.Pistol(this.game, this));
		this.weapons.push(new Doomsday.Weapons.SMG(this.game, this));

		this.currentWeapon = 0;
		for(var i = 1; i < this.weapons.length; i++) {
			this.weapons[i].visible = false;
		}

	};

	Player.prototype = Object.create(Phaser.Group.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function () {
		this.handleInput();

		this.legs.x = this.torso.x;
		this.legs.y = this.torso.y;
		this.legs.moves = false;

		// this.game.debug.body(this.legs);
    	// this.game.debug.body(this.torso);

		// this.game.debug.bodyInfo(this.legs, 500, 132);
		// this.game.debug.spriteBounds(this.torso, 500, 232);
	};

	Player.prototype.fire = function() {
		if(!this.alive) return;
		this.weapons[this.currentWeapon].fire(this.torso, this.torso.angle);
	};

	Player.prototype.handleInput = function () {
		if(!this.alive) return;

		var moving = false;
		this.torso.rotation = this.game.physics.arcade.angleToPointer(this.torso) + (Math.PI / 2);
		this.legs.rotation = this.torso.rotation;

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			this.torso.body.velocity.y = -this.speed;
			this.legs.rotation = Phaser.Math.degToRad(180);
			moving = true;
		} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			this.torso.body.velocity.y = this.speed;
			this.legs.rotation = Phaser.Math.degToRad(0);
			moving = true;
		} else {
			this.torso.body.velocity.y = 0;
		}

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
			this.torso.body.velocity.x = -this.speed;
			this.legs.rotation = Phaser.Math.degToRad(270);
			moving = true;
		} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
			this.torso.body.velocity.x = this.speed;
			this.legs.rotation = Phaser.Math.degToRad(90);
			moving = true;
		} else {
			this.torso.body.velocity.x = 0;
		}

		// if (this.game.input.activePointer.isDown) {
		// 	this.weaponManager.fire();
		// }

		if (moving) {
			this.legs.animations.play('walk', 4, true);
		} else {
			this.legs.animations.stop('walk');
		}

// 		this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
// 		this.rKey.onDown.add(function() {
// 			this.weapon.reload();
// 		}, this);
	};

	Player.prototype.selectWeapon = function(index) {
		this.weapons[this.currentWeapon].weapon.visible = false;
		this.weapons[this.currentWeapon].bullets.visible = false;
		this.weapons[this.currentWeapon].bullets.callAll('reset', null, 0, 0);
		this.weapons[this.currentWeapon].bullets.setAll('exists', false);

		this.currentWeapon = index;
		if(this.currentWeapon < 0 || this.currentWeapon >= this.weapons.length) {
			this.currentWeapon = 0;
		}
		this.weapons[this.currentWeapon].weapon.visible = true;
		this.weapons[this.currentWeapon].bullets.visible = true;
		console.log(this.weapons[this.currentWeapon].weapon.name);
	};

	Player.prototype.damage = function(amount) {
		if(this.alive) {
			this.health -= amount;

			if(this.health <= 0) {
				this.die();
			}
		}

		return this;
	}

	Player.prototype.die = function() {
		this.callAll('kill');
		this.alive = false;

		this.corpse.visible = true;
		this.corpse.x = this.torso.x
		this.corpse.y = this.torso.y
		this.corpse.animations.play('splat', 14, false);
		this.game.camera.fade("#000", 1000)
		this.game.camera.onFadeComplete.addOnce(function() {
			this.game.state.start('GameOver');
		}, this);

	}

	return Player;
} ());