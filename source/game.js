/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update
});

function preload() {
	game.load.tilemap('mario', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', 'assets/maps/tilemap.png');

	game.load.image('soldier-torso', 'assets/soldier/soldier_torso_DW.png');
	game.load.spritesheet('soldier-legs', 'assets/soldier/soldier-legs.png', 64, 64, 4);
	game.load.image('soldier-legs-1', 'assets/soldier/soldier_legs_0001.png');
	game.load.image('soldier-legs-2', 'assets/soldier/soldier_legs_0002.png');
	game.load.image('soldier-legs-3', 'assets/soldier/soldier_legs_0003.png');
	game.load.image('soldier-legs-4', 'assets/soldier/soldier_legs_0004.png');
	game.load.image('bullet', 'assets/projectile2.png');

	game.load.atlas('soldier', 'assets/soldier.png', 'assets/soldier.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
	game.load.atlas('zombie', 'assets/zombie.png', 'assets/zombie.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
	game.load.atlas('weapons', 'assets/weapons.png', 'assets/weapons.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
	game.load.atlas('blood', 'assets/blood.png', 'assets/blood.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	//this.scale.pageAlignHorizontally = true;
	// game.scale.pageAlignVertically = true;
	// game.scale.setScreenSize( true );
}

var map;
var layer;
var player;
var enemy;
var zombies = [];

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#787878';


	//  The 'mario' key here is the Loader key given in game.load.tilemap
	map = game.add.tilemap('mario');

	//  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
	//  The second parameter maps this name to the Phaser.Cache key 'tiles'
	map.addTilesetImage('floor', 'tiles');

	//  Creates a layer from the World1 layer in the map data.
	//  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
	layer = map.createLayer('Floor');

	//  This resizes the game world to match the layer dimensions
	layer.resizeWorld();

	player = new Player(game);

	for(var i = 0; i < 100; i++) {
		zombies.push(new Enemy(game, player));
	}
	game.add.text(17, 17, '1: Pistol, 2: Submachinegun', {});
}

function update() {
	player.update();

	for(var i in zombies) {
		var z = zombies[i];
		var zs = zombies[i].sprite;
		if(zs.alive) {
			this.game.physics.arcade.collide(player.sprite, zs);
			var hit = this.game.physics.arcade.overlap(player.weapon.bullets, zs, bulletHitEnemy, null, this);
			if(hit) {
				z.onHit();
			}
			z.update();
		}
	}
}

function bulletHitEnemy(zombie, bullet) {
	zombie.alive = false;
	bullet.kill();
}
