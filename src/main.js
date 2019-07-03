// Global Variables
var
    game = new Phaser.Game(screen.width, screen.height, Phaser.AUTO, 'game'),
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
        game.load.spritesheet('car1', 'assets/images/car1.png');
        game.load.spritesheet('car2', 'assets/images/car2.png');
        game.load.spritesheet('ball', 'assets/images/ball.png');
        game.load.physics("collision", "assets/collision/collision.json");
        game.load.tilemap('map', 'assets/phaserleague_tiledmap_arena1_capreal.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.physics("sprite_physics", "assets/collision/sprite_physics.json");
        game.load.image('tiles', 'assets/set_capreal.gif');
    },

    create: function () {
        game.state.add('Splash', Splash);
        game.state.start('Splash');
    }
};

game.state.add('Main', Main);
game.state.start('Main');
