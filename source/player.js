var Player = (function() {
    function Player(game) {
        this.game = game;

        this.soldier = {
            torso: this.game.add.sprite(128, 128, 'soldier', 'soldier_torso_1h.png'),
            legs: this.game.add.sprite(128, 128, 'soldier', 'soldier_legs_0001.png')
        };

        this.soldier.torso.anchor.setTo(0.5, 0.5);
        this.soldier.legs.anchor.setTo(0.5, 0.5);
        this.soldier.legs.bringToTop();
        this.soldier.torso.bringToTop();


        this.walkingAnimation = this.soldier.legs.animations.add('walk', Phaser.Animation.generateFrameNames('soldier_legs_000' , 1 ,  4 ,  '.png'));

        this.game.physics.arcade.enable(this.soldier.torso);
        this.game.camera.follow(this.soldier.torso);
        this.soldier.torso.body.collideWorldBounds = true;
        this.maxSpeed = 250;

        this.weapons = {
            pistol: new Pistol(this.game, this.soldier.torso),
            submachinegun: new Submachinegun(this.game, this.soldier.torso)
        };

        this.weapon = this.weapons.pistol;
        this.weapon.equip();

        this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.key1.onDown.add(function() {
            this.weapon.unequip();
            this.weapon = this.weapons.pistol;
            this.weapon.equip();
        }, this);

        this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.key2.onDown.add(function() {
            this.weapon.unequip();
            this.weapon = this.weapons.submachinegun;
            this.weapon.equip();
        }, this);
    }

    Player.prototype.update = function() {
        this._handleInput();

        this.soldier.legs.x = this.soldier.torso.x;
        this.soldier.legs.y = this.soldier.torso.y;
        //this.soldier.legs.rotation = this.soldier.torso.rotation;
    };

    Player.prototype._handleInput = function() {
        var speed = 5;
        var moving = false;
        this.soldier.torso.rotation = this.game.physics.arcade.angleToPointer(this.soldier.torso) + (Math.PI / 2);
        this.soldier.legs.rotation = this.soldier.torso.rotation;

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.soldier.torso.y -= speed;
            this.soldier.legs.rotation = Phaser.Math.degToRad(180);
            moving = true;
        }

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.soldier.torso.y += speed;
            this.soldier.legs.rotation = Phaser.Math.degToRad(0);
            moving = true;
        }

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.soldier.torso.x -= speed;
            this.soldier.legs.rotation = Phaser.Math.degToRad(270);
            moving = true;
        } else if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.soldier.torso.x += speed;
            this.soldier.legs.rotation = Phaser.Math.degToRad(90);
            moving = true;
        }

        if(this.game.input.activePointer.isDown) {
            this.weapon.fire();
        }

        if(moving) {
            if(!this.walkingAnimation.isPlaying)
                this.walkingAnimation.play(4, true);
        } else {
            this.walkingAnimation.stop();
        }
    };

    return Player;
}());