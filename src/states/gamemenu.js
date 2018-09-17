var GameMenu = function () {
};

GameMenu.prototype = {

    menuConfig: {
        startY: 260,
        startX: 30
    },

    init: function () {
        this.titleText = game.make.text(game.world.centerX, 100, "Phaser Racer", {
            font: 'bold 60pt Arial',
            fill: '#0000FF',
            align: 'center'
        });
        this.startGame = game.make.text(game.world.centerX, game.world.centerY, "Start", {
            font: 'bold 32pt Arial',
            fill: '#FF0000',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
        this.optionCount = 1;
    },

    create: function () {
        var styleCountDown = { font: "42px Arial", fill: "#ff0000", align: "center" };
        self.textWinner = game.add.text(game.world.centerX, game.world.centerY - 50, 'Select Number of Players, ONE or TWO?', styleCountDown);
        self.textWinner.anchor.set(0.5);

        game.state.states.Game.settings = {numberOfPlayers: 0};
    },

    update: function() {
        if(game.input.keyboard.addKey(Phaser.Keyboard.ONE).isDown) {
            game.state.states.Game.settings.numberOfPlayers = 1;
            game.state.start("Game");
        } else if (game.input.keyboard.addKey(Phaser.Keyboard.TWO).isDown) {
            game.state.states.Game.settings.numberOfPlayers = 2;
            game.state.start("Game");
        }
    }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
