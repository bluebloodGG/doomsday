/* global Doomsday: true, Phaser: true */
'use strict';

(function() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, '');
    game.state.add('Boot', Doomsday.Boot);
    game.state.add('Preloader', Doomsday.Preloader);
    game.state.add('Menu', Doomsday.Menu);
    game.state.add('Game', Doomsday.Main);
    //game.state.add('GameOver', Doomsday.GameOver);
    game.state.start('Boot');
})();
