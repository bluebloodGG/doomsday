Doomsday.WaveManager = (function() {
	function WaveManager(game, player, parent, spawners) {
		this.game = game;
		this.player = player;
		this.parent = parent;
		this.spawners = spawners;
		this.monsterManager = new Doomsday.MonsterManager(this.game, this.player.torso, this.layerMonsters, this.spawners);
		this.style = { font: "bold 32px Arial", fill: "#FFF" };

		this.waveText = this.game.add.text(this.game.camera.width / 2, (this.game.camera.height / 2)-200, "Next wave starting in: 5", this.style)
		this.waveText.fixedToCamera = true;
		this.waveText.anchor.set(0.5);

		this.nextWave();
	}

	WaveManager.prototype.update = function() {
		this.monsterManager.update();
	}

	WaveManager.prototype.render = function() {
		this.monsterManager.render();
	}

	WaveManager.prototype.start = function() {

	};

	WaveManager.prototype.getCurrentWaveMonsters = function() {
		return this.monsterManager.monsters;
	};

	WaveManager.prototype.nextWave = function() {
		this.monsterManager.destroyThemAll();
		this.waveInProgress = false;
		this.waveText.visible = true;
		this.counter = 1;
		this.waveText.text = "Next wave starting in: " + this.counter;
		this.game.time.events.repeat(Phaser.Timer.SECOND, 1, this.updateWaveTimer, this);
	}
	WaveManager.prototype.updateWaveTimer = function() {
		this.counter--;
		this.waveText.text = "Next wave starting in: " + this.counter;
		if(this.counter == 0) {
			this.game.time.events.add(Phaser.Timer.HALF, function() {
				this.waveInProgress = true;
				this.waveText.visible = false;
				this.monsterManager.generateMonsters(10);
			}, this);

		}
	}

	return WaveManager;
}());