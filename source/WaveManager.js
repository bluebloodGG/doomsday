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
		this.currentWave = 0;

		this.nextWave();
	}

	WaveManager.prototype.update = function() {
		this.monsterManager.update();

		if(this.waveInProgress && this.monsterManager.monstersAlive === 0){
			console.log("start next wave!");
			this.nextWave();
		}

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
		this.currentWave++;
		this.monsterManager.destroyThemAll();
		this.waveInProgress = false;
		this.waveText.visible = true;
		this.counter = 1;
		this.waveText.text = "Wave " + this.currentWave + " starting in: " + this.counter;
		this.player.torso.body.velocity.set(0);
		this.player.legs.animations.stop();
		this.game.time.events.repeat(Phaser.Timer.SECOND, 1, this.updateWaveTimer, this);
	}
	WaveManager.prototype.updateWaveTimer = function() {
		this.counter--;
		this.waveText.text = "Wave " + this.currentWave + " starting in: " + this.counter;
		if(this.counter == 0) {
			this.game.time.events.add(Phaser.Timer.HALF, function() {
				this.waveInProgress = true;
				this.waveText.visible = false;
				this.monsterManager.generateMonsters(10, this.currentWave);
			}, this);

		}
	}

	return WaveManager;
}());