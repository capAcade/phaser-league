// Global Variables
var
    game = new Phaser.Game(1280, 1024, Phaser.AUTO, 'game'),
    Main = function () {
    },
    gameOptions = {
        playSound: true,
        playMusic: true
    },
    musicPlayer;

Main.prototype = {

    preload: function () {
        game.load.image('splash-bg', 'assets/images/splash-bg.jpg');
        game.load.image('loading', 'assets/images/loading.png');
        game.load.image('brand', 'assets/images/logo.png');
        game.load.script('polyfill', 'lib/polyfill.js');
        game.load.script('utils', 'lib/utils.js');
        game.load.script('splash', 'states/Splash.js');
        game.load.spritesheet('map', 'assets/images/map.jpg');
        game.load.spritesheet('car1', 'assets/images/car.png');
        game.load.spritesheet('car2', 'assets/images/car2.png');
        game.load.spritesheet('ball', 'assets/images/ball.png');
        game.load.physics("collision", "assets/collision/collision.json");
    },

    create: function () {
        game.state.add('Splash', Splash);
        game.state.start('Splash');
    }
};

game.state.add('Main', Main);
game.state.start('Main');
