(function () {

	firebase.initializeApp(Doomsday.config.firebase);

	firebase.auth().signInAnonymously().catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		debugger;
	});

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

		var that = this;
		firebase.database().ref('highscores/').once('value').then(function (snapshot) {

			that.highscores = snapshot.val();
		});
		// if (key === undefined) key = 'default';
		// var state = localStorage.getItem('save-' + key);
		// if (state) {
		// 	this.unserialize(state);
		// }
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