/* global Phaser */
var Enemy = (function() {
    function Enemy(game, player) {
        this.game = game;
        this.player = player;

        this.sprite = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'zombie', 'zombie_move_0001');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.anim = {
            walk: this.sprite.animations.add('walk', Phaser.Animation.generateFrameNames('zombie_move_000', 1, 4)),
            attack: this.sprite.animations.add('attack', Phaser.Animation.generateFrameNames('zombie_attack_000', 1, 2)),
            spawn: this.sprite.animations.add('spawn', Phaser.Animation.generateFrameNames('zombie_spawn_000', 1, 2))
        };

        this.game.physics.arcade.enable(this.sprite);

        this.anim.walk.play(4, true);
    }

    Enemy.prototype.update = function() {
        this.sprite.rotation = this.game.physics.arcade.moveToXY(this.sprite, this.player.soldier.torso.x, this.player.soldier.torso.y, 90) - (Math.PI / 2);
    };

    return Enemy;
}());