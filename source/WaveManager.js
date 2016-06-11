Doomsday.WaveManager = (function() {
	function WaveManager(game, player, parent, spawners) {
		this.game = game;
		this.player = player;
		this.parent = parent;
		this.spawners = spawners;
		this.monsterManager = new Doomsday.MonsterManager(this.game, this.player.torso, this.layerMonsters, this.spawners);
	}

	WaveManager.prototype.update = function() {
		this.monsterManager.update();
	}

	WaveManager.prototype.render = function() {
		this.monsterManager.render();
	}

	WaveManager.prototype.start = function() {
		this.monsterManager.generateMonsters(25);
	};

	WaveManager.prototype.getCurrentWaveMonsters = function() {
		return this.monsterManager.monsters;
	}

	return WaveManager;
}());