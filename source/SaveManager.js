(function () {

	Phaser.Game.prototype.saveHighscore = function (data) {
		$.ajax({
			type: "POST",
			url: "/highscore",
			data: JSON.stringify(data),
			contentType: 'application/json'
		});
	};

	Phaser.Game.prototype.loadHighscores = function (callback, context) {

		$.ajax({
			type: "GET",
			url: "/highscores",
			dataType: 'json',
			success: function(data) {
				callback.call(context, data)
			}
		});

	};

	Phaser.Game.prototype.serialize = function () {
		var saveObject = {
			highscores: this.highscores.sort(sortHighscores)
		};
		if (this.highscores.length > 10) this.highscores.pop();

		return JSON.stringify(saveObject);
	};

	Phaser.Game.prototype.unserialize = function (state) {
		var saveObject = JSON.parse(state);
		this.highscores = saveObject.highscores.sort(sortHighscores);
	};

	function sortHighscores(a, b) {
		return b.score - a.score;
	}
} ());