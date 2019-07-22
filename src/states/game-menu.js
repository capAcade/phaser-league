var GameMenu = function () {};

GameMenu.prototype = {

    create: function () {
        var styleText = { font: "42px Arial", fill: "#ffffff", align: "center" };
        self.textPlayerSelect1 = game.add.text(game.world.centerX, game.world.centerY - 50, 'Select number of players', styleText);
        self.textPlayerSelect2 = game.add.text(game.world.centerX, game.world.centerY + 50, 'One player or two player', styleText);
        self.textPlayerSelect1.anchor.set(0.5);
        self.textPlayerSelect2.anchor.set(0.5);

        game.state.states.Game.settings = {humanPlayers: 0};
    },

    update: function() {
        if(game.input.keyboard.addKey(Phaser.Keyboard.N).isDown) {
            game.state.states.Game.settings.humanPlayers = 1;
            game.state.start("Game");
        } else if (game.input.keyboard.addKey(Phaser.Keyboard.M).isDown) {
            game.state.states.Game.settings.humanPlayers = 2;
            game.state.start("Game");
        }
    }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
