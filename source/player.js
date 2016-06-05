Doomsday.Player = (function () {
	function Player(game) {
		Phaser.Group.call(this, game);

		this.game = game;

		this.enableBody = true;
		this.physicsBodyType = Phaser.Physics.ARCADE;
		this.legs = this.create(128, 128, 'soldier', 'soldier_legs_0001.png');
		this.torso = this.create(128, 128, 'soldier', 'soldier_torso_1h.png');

		this.setAll('anchor.x', 0.5);
		this.setAll('anchor.y', 0.5);
		this.setAll('outOfBoundsKill', true);
		this.setAll('checkWorldBounds', true);

		this.legs.animations.add('walk', Phaser.Animation.generateFrameNames('soldier_legs_000', 1, 4, '.png'));

		this.game.camera.follow(this.torso);
		this.speed = 350;
		this.weapons = {
			pistol: new Pistol(this.game, this.torso),
			submachinegun: new Submachinegun(this.game, this.torso)
		};

		this.weapon = this.weapons.pistol;
		this.weapon.equip();
	};

	Player.prototype = Object.create(Phaser.Group.prototype);
    Player.prototype.constructor = Player;

	Player.prototype.update = function () {
		this.legs.x = this.torso.x;
		this.legs.y = this.torso.y;

		this.handleInput();


	};

	Player.prototype.handleInput = function () {

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

		if (this.game.input.activePointer.isDown) {
			this.weapon.fire();
		}

		if (moving) {
			this.legs.animations.play('walk', 4, true);
		} else {
			this.legs.animations.stop('walk');
		}

		this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		this.key1.onDown.add(function () {
			this.weapon.unequip();
			this.weapon = this.weapons.pistol;
			this.weapon.equip();
		}, this);

		this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
		this.key2.onDown.add(function () {
			this.weapon.unequip();
			this.weapon = this.weapons.submachinegun;
			this.weapon.equip();
		}, this);
	};

	return Player;
} ());




// var Player2 = (function () {
// 	function Player(game) {
// 		this.game = game;

// 		this.soldier = {
// 			torso: this.game.add.sprite(128, 128, 'soldier', 'soldier_torso_1h.png'),
// 			legs: this.game.add.sprite(128, 128, 'soldier', 'soldier_legs_0001.png')
// 		};

// 		this.soldier.torso.anchor.setTo(0.5, 0.5);
// 		this.soldier.legs.anchor.setTo(0.5, 0.5);
// 		this.soldier.legs.bringToTop();
// 		this.soldier.torso.bringToTop();


// 		this.walkingAnimation = this.soldier.legs.animations.add('walk', Phaser.Animation.generateFrameNames('soldier_legs_000', 1, 4, '.png'));



// 		this.weapon = this.weapons.pistol;
// 		this.weapon.equip();

// 		this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
// 		this.key1.onDown.add(function () {
// 			this.weapon.unequip();
// 			this.weapon = this.weapons.pistol;
// 			this.weapon.equip();
// 		}, this);

// 		this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
// 		this.key2.onDown.add(function () {
// 			this.weapon.unequip();
// 			this.weapon = this.weapons.submachinegun;
// 			this.weapon.equip();
// 		}, this);
// 	}

// 	Player.prototype.update = function () {
// 		this._handleInput();

// 		this.soldier.legs.x = this.soldier.torso.x;
// 		this.soldier.legs.y = this.soldier.torso.y;
// 		//this.soldier.legs.rotation = this.soldier.torso.rotation;
// 	};

// 	Player.prototype._handleInput = function () {

// 	};

// 	return Player;
// } ());