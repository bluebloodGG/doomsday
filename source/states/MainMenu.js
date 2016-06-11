/* global Doomsday: true, Phaser: true */
'use strict';

Doomsday.Menu = function(game) {};

Doomsday.Menu.prototype = {

    preload: function() {

    },

    create: function() {

        this.wallpaper = this.game.add.sprite(0, 0, 'wallpaper');

        this.logo = this.game.add.sprite(this.camera.width / 2, (this.camera.height / 2) - 150, 'doomsday');
        this.logo.anchor.set(0.5);


        this.spaceToPlay = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1, 95, 0, 0, 0, 16);
		this.spaceToPlayImage = this.game.add.image(this.logo.x, this.camera.height - 150, this.spaceToPlay);
        this.spaceToPlayImage.anchor.set(0.5);
        this.game.add.tween(this.spaceToPlayImage).to( { alpha: 0.1 }, 1000, "Linear", true, 0, -1, true);

        this.camera.reset();
        //this.game.state.start('Game');
        //this.game.state.start('GameOver');
        this.game.playerName = "jesper";
    },

    update: function() {
        this.spaceToPlay.text = "PRESS SPACE TO PLAY"

        if(!this.game.playerName)
            this.game.playerName = prompt('Namn');

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            this.game.state.start('Game');
        }
    },

    render: function() {

    }
};