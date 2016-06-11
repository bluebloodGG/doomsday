/* global Doomsday: true, Phaser: true */
'use strict';

Doomsday.GameOver = function (game) { };

Doomsday.GameOver.prototype = {

    preload: function () {

    },

    create: function () {

        this.wallpaper = this.game.add.sprite(300, 0, 'wallpaper');
        this.gameover_wallpaper = this.game.add.sprite(0, 0, 'gameover-wallpaper');
        this.gameover_wallpaper.alpha = 0.15;

        this.gameover = this.game.add.sprite(this.camera.width / 2, 100, 'gameover');
        this.gameover.anchor.set(0.5);

        this.quitFont = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1, 95, 0, 0, 0, 32);
        this.quitImage = this.game.add.image(this.gameover.x, this.camera.height - 50, this.quitFont);
        this.quitImage.anchor.set(0.5);
        //this.game.add.tween(this.quitImage).to( { alpha: 0.1 }, 1000, "Linear", true, 0, -1, true);

        this.restartFont = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1, 95, 0, 0, 0, 16);
        this.restartImage = this.game.add.image(this.gameover.x, this.camera.height - 140, this.restartFont);
        this.restartImage.anchor.set(0.5);
        this.restartImage.scale.set(2.5);
        //this.game.add.tween(this.restartImage).to( { alpha: 0.1 }, 1000, "Linear", true, 0, -1, true);

        // this.scoreFont = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1);
        // this.scoreImage = this.game.add.image(this.game.camera.width / 2, this.camera.height - 248, this.scoreFont);
        // this.scoreImage.fixedToCamera = true;
        // this.scoreImage.anchor.set(0.5);

        // this.timerFont = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1);
        // this.timerImage = this.game.add.image(this.game.camera.width / 2, this.camera.height - 200, this.timerFont);
        // this.timerImage.fixedToCamera = true;
        // this.timerImage.anchor.set(0.5);

        this.game.loadHighscores(function (highscores) {

            this.highscoreDisplay = [];

            var highscoreX = this.game.camera.width / 2;
            var highscoreY = 200;
            var i = 0;
            for (var idx in highscores) {
                var flash = false;
                var highscore = highscores[idx];
                var font = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1);

                if (this.game.playerName === highscore.name && this.game.score === highscore.score && this.game.elapsedTime === highscore.elapsedTime) {
                    font = this.game.add.retroFont('ESPrade', 16, 16, Phaser.RetroFont.TEXT_SET1, 95, 0, 0, 0, 32);
                    flash = true;
                }
                var image = this.game.add.image(highscoreX, highscoreY + (i * 32), font);
                image.fixedToCamera = true;
                image.anchor.setTo(0.5);
                font.text = this.buildHighscoreString(i, highscore);

                if (flash) {
                    this.game.add.tween(image).to({ alpha: 0.1 }, 1000, "Linear", true, 0, -1, true);
                }


                this.highscoreDisplay.push({
                    font: font,
                    image: image
                });

                i++;
            }
        }, this);

        this.camera.reset();
    },

    update: function () {
        this.restartFont.text = "SPACE TO RESTART"
        this.quitFont.text = "ESC TO QUIT"
        // this.timerFont.text = "Survived: " + this.game.elapsedTime;
        // this.scoreFont.text = "Score: " + this.game.score;





        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
            this.game.state.start('Menu');
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start('Game');
        }
    },

    render: function () {

    },

    buildHighscoreString: function (index, highscore) {
        var place = String("     " + (index + 1)).slice(-5);
        if (!highscore.name) highscore.name = "";
        var name = String("          " + highscore.name.substring(0, 10)).slice(-10)
        var elapsedTime = highscore.elapsedTime
        var score = String("....." + highscore.score).slice(-5);
        return [place, name, elapsedTime, score].join(" - ");
    }
};