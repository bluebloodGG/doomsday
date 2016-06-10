/* global Doomsday: true, Phaser: true */
'use strict';

Doomsday.GameOver = function(game) {};

Doomsday.GameOver.prototype = {

    preload: function() {

    },

    create: function() {

        this.wallpaper = this.game.add.sprite(0, 0, 'wallpaper');
        this.gameover_wallpaper = this.game.add.sprite(0, 0, 'gameover-wallpaper');
        this.gameover_wallpaper.alpha= 0.15;

        this.gameover = this.game.add.sprite(this.camera.width / 2, (this.camera.height / 2) - 150, 'gameover');
        this.gameover.anchor.set(0.5);

        this.quitFont = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1, 95, 0, 0, 0, 32);
		this.quitImage = this.game.add.image(this.gameover.x, this.camera.height - 50, this.quitFont);
        this.quitImage.anchor.set(0.5);
        //this.game.add.tween(this.quitImage).to( { alpha: 0.1 }, 1000, "Linear", true, 0, -1, true);

        this.restartFont = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1, 95, 0, 0, 0, 16);
		this.restartImage = this.game.add.image(this.gameover.x, this.camera.height - 150, this.restartFont);
        this.restartImage.anchor.set(0.5);
        this.game.add.tween(this.restartImage).to( { alpha: 0.1 }, 1000, "Linear", true, 0, -1, true);

        this.scoreFont = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1);
		this.scoreImage = this.game.add.image(this.game.camera.width / 2, this.camera.height - 248, this.scoreFont);
		this.scoreImage.fixedToCamera = true;
        this.scoreImage.anchor.set(0.5);

        this.timerFont = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1);
		this.timerImage = this.game.add.image(this.game.camera.width / 2, this.camera.height - 200, this.timerFont);
		this.timerImage.fixedToCamera = true;
		this.timerImage.anchor.set(0.5);

        this.camera.reset();
    },

    update: function() {
        this.restartFont.text = "SPACE TO RESTART"
        this.quitFont.text = "ESC TO QUIT"
        this.timerFont.text = "Survived: " + this.game.elapsedTime;
        this.scoreFont.text = "Score: " + this.game.score;

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)){
            this.game.state.start('Menu');
        }

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            this.game.state.start('Game');
        }
    },

    render: function() {

    }
};