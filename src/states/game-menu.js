var GameMenu = function () {};
var keyst = JSON.parse(localStorage.getItem("capManKeys"));
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
        if(keyst === null) {
            keyst = {
                playerOne: {
                    up: Phaser.Keyboard.W,
                    down: Phaser.Keyboard.S,
                    left: Phaser.Keyboard.A,
                    right: Phaser.Keyboard.D,
                    green: Phaser.Keyboard.J,
                    black: Phaser.Keyboard.I,
                    white: Phaser.Keyboard.U,
                    blueBelowWhite: Phaser.Keyboard.K,
                    topRightBlue: Phaser.Keyboard.O,
                    buttomRightBlue: Phaser.Keyboard.L
                },
                playerTwo: {
                    up: Phaser.Keyboard.UP,
                    down: Phaser.Keyboard.DOWN,
                    left: Phaser.Keyboard.LEFT,
                    right: Phaser.Keyboard.RIGHT,
                    green: Phaser.Keyboard.NUMPAD_4,
                    black: Phaser.Keyboard.NUMPAD_8,
                    white: Phaser.Keyboard.NUMPAD_7,
                    blueBelowWhite: Phaser.Keyboard.NUMPAD_5,
                    topRightBlue: Phaser.Keyboard.NUMPAD_9,
                    buttomRightBlue: Phaser.Keyboard.NUMPAD_6
                },
                pinBallLeft: Phaser.Keyboard.Z,
                pinBallRight: Phaser.Keyboard.NUMPAD_3,
                OnePlayerSelection: Phaser.Keyboard.N,
                TwoPlayerSelection: Phaser.Keyboard.M
            }
        }



        if(game.input.keyboard.addKey(keyst.OnePlayerSelection).isDown) {
            game.state.states.Game.settings.humanPlayers = 1;
            game.state.start("Game");
        } else if (game.input.keyboard.addKey(keyst.TwoPlayerSelection).isDown) {
            game.state.states.Game.settings.humanPlayers = 2;
            game.state.start("Game");
        }
    }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
