var Game = function (game) { };

Game.prototype = {
    preload: function () {
        this.humanPlayers = game.state.states.Game.settings.humanPlayers;

        this.optionCount = 1;
        this.playerCount = 2;
        this.cars = [];
        this.map = {};
        this.layer = {};
        this.score = [0, 0];
        this.enableScoring = true;
        this.maxScore = 5;

        this.countDownMessage = '';
        this.countDown = '';

        this.velocity = [];
        var i;
        for (i = 0; i < this.playerCount; i++) {
            this.velocity.push(0);
        }

        this.carsOption = [
            {
                "name": "car1",
                "beginX": game.world.centerX - 320,
                "beginY": game.world.centerY,
                "beginAngle": 90
            },
            {
                "name": "car2",
                "beginX": game.world.centerX + 320,
                "beginY": game.world.centerY,
                "beginAngle": 270
            }
        ];

        this.soundEngine = [];
        this.soundRev = [];
        this.soundSkid = [];

        this.enginePlaying = [false, false];
        this.revPlaying = [false, false];
        this.skidPlaying = [false, false];
    },
    create: function () {
        var self = this;

        // Set background color
        game.stage.backgroundColor = 'rgb(22, 135, 139)';

        /*Enable Phyics Engine*/
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        /*Adding Map*/
        self.map = game.add.tilemap('map');
        self.map.addTilesetImage('phaserleague_tileset_capreal', 'tiles');
        self.layer = self.map.createLayer('Arena1');
        self.layer.anchor.set(0.5);
        self.layer.x = screen.width - (1280 / 2);
        self.layer.y = screen.height - (1024 / 2);
        self.layer.fixedToCamera = false;

        /*Adding cars*/
        for (var i = 0; i < self.playerCount; i++) {
            self.cars[i] = game.add.sprite(self.carsOption[i].beginX, self.carsOption[i].beginY, self.carsOption[i].name);
            game.physics.p2.enable(self.cars[i]);
            //self.cars[i].body.loadPolygon("sprite_physics", self.carsOption[i].name);
            self.cars[i].body.collideWorldBounds = true;
            self.cars[i].body.angle = self.carsOption[i].beginAngle;
        }

        /*Adding Ball*/
        self.ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
        game.physics.p2.enable(self.ball);
        //elf.ball.body.loadPolygon("sprite_physics", 'ball');
        self.ball.body.setCircle(24);
        self.ball.body.collideWorldBounds = true;

        /*Create Collision Groups*/
        var car1CollisionGroup = game.physics.p2.createCollisionGroup();
        var car2CollisionGroup = game.physics.p2.createCollisionGroup();
        var ballCollisionGroup = game.physics.p2.createCollisionGroup();

        var wallsCG = game.physics.p2.createCollisionGroup();
        var Goal1CG = game.physics.p2.createCollisionGroup();
        Goal1CG.name = "Goal1";
        var Goal2CG = game.physics.p2.createCollisionGroup();
        Goal2CG.name = "Goal2";
        // game.physics.p2.updateBoundsCollisionGroup();

        //Set Collision Groups
        self.cars[0].body.setCollisionGroup(car1CollisionGroup);
        self.cars[1].body.setCollisionGroup(car2CollisionGroup);
        self.ball.body.setCollisionGroup(ballCollisionGroup);

        var walls = game.physics.p2.convertCollisionObjects(self.map, "Walls", true);
        for (var wall in walls) {
            walls[wall].x = walls[wall].x + (screen.width - 1280) / 2;
            walls[wall].y = walls[wall].y + (screen.height - 1024) / 2;
            walls[wall].setCollisionGroup(wallsCG);
            walls[wall].collides([car1CollisionGroup, car2CollisionGroup, ballCollisionGroup]);
        }

        /* TODO: We can probably remove the for-loops, as we now have a seperate layer per goal. */
        var goal1 = game.physics.p2.convertCollisionObjects(self.map, "Goal1", true);
        for (var goal in goal1) {
            goal1[goal].x = goal1[goal].x + (screen.width - 1280) / 2;
            goal1[goal].y = goal1[goal].y + (screen.height - 1024) / 2;
            goal1[goal].setCollisionGroup(Goal1CG);
            goal1[goal].collides(ballCollisionGroup);
        }
        var goal2 = game.physics.p2.convertCollisionObjects(self.map, "Goal2", true);
        for (var goal in goal2) {
            goal2[goal].x = goal2[goal].x + (screen.width - 1280) / 2;
            goal2[goal].y = goal2[goal].y + (screen.height - 1024) / 2;
            goal2[goal].setCollisionGroup(Goal2CG);
            goal2[goal].collides(ballCollisionGroup);
        }

        //Set Collision
        self.cars[0].body.collides([car2CollisionGroup, ballCollisionGroup, wallsCG]);
        self.cars[1].body.collides([car1CollisionGroup, ballCollisionGroup]);
        self.cars[1].body.collides([wallsCG], self.handleCarWallCollision, this); // if car 2 hits wall
        self.ball.body.collides([car1CollisionGroup, car2CollisionGroup, wallsCG]);
        self.ball.body.collides([Goal1CG], self.handleGoal1, this);
        self.ball.body.collides([Goal2CG], self.handleGoal2, this);

        // render score
        var style1 = { font: "42px Arial", fill: "#95e616", align: "center" };
        var style2 = { font: "42px Arial", fill: "#ff304c", align: "center" };
        self.textScore1 = game.add.text(game.world.centerX - 50, 50, self.score[0], style1);
        self.textScore2 = game.add.text(game.world.centerX + 50, 50, self.score[1], style2);
        self.textScore1.anchor.set(0.5);
        self.textScore2.anchor.set(0.5);

        // Add Sounds
        // self.soundEngine = [game.add.audio('engine1'), game.add.audio('engine2')];
        // self.soundRev = [game.add.audio('rev1'), game.add.audio('rev2')]
        // self.soundSkid = [game.add.audio('skid1'), game.add.audio('skid2')]
    },
    handleCarWallCollision: function () {
        var self = this;
        self.cars[1].hitWall = true;
        self.cars[1].stuckCount = 0;
    },
    handleGoal1: function () {
        var self = this;
        if (self.enableScoring) {
            self.enableScoring = false;
            self.scoredPlayer = '2';
            self.scoreGoal(1);
        }
    },
    handleGoal2: function () {
        var self = this;
        if (self.enableScoring) {
            self.enableScoring = false;
            self.scoredPlayer = '1';
            self.scoreGoal(0);
        }
    },
    scoreGoal: function (goal) {
        var self = this;
        self.resetPosition();
        self.score[goal]++;
        self.textScore1.setText(self.score[0]);
        self.textScore2.setText(self.score[1]);

    },
    resetPosition: function () {
        var self = this;
        var styleCountDown = { font: "42px Arial", fill: "#ffffff", align: "center" };

        if (self.score[0] >= self.maxScore - 1 || self.score[1] >= self.maxScore - 1) {
            self.textWinner = game.add.text(game.world.centerX, game.world.centerY - 50, 'A WINNER IS YOU', styleCountDown);
            self.textWinner.anchor.set(0.5);

            setTimeout(function () {
                window.history.back();
            }, 5000);
        } else {
            self.textCountDownMessage = game.add.text(game.world.centerX, game.world.centerY - 50, 'Player ' + self.scoredPlayer + ' scored!', styleCountDown);
            self.textCountDownMessage.anchor.set(0.5);
            self.textCountDown3 = game.add.text(game.world.centerX, game.world.centerY, 'READY! 3', styleCountDown);
            self.textCountDown3.anchor.set(0.5);

            setTimeout(function () {
                self.textCountDown2 = game.add.text(game.world.centerX, game.world.centerY, 'SET? 2', styleCountDown);
                self.textCountDown2.anchor.set(0.5);
                self.textCountDown3.destroy();
            }, 1000);

            setTimeout(function () {
                self.textCountDown1 = game.add.text(game.world.centerX, game.world.centerY, 'GO! 1', styleCountDown);
                self.textCountDown1.anchor.set(0.5);
                self.textCountDown2.destroy();
            }, 2000);

            //start countdown animation
            setTimeout(function () {
                self.textCountDown1.destroy();
                self.textCountDownMessage.destroy();
                for (var i = 0; i < self.playerCount; i++) {
                    self.cars[i].body.angle = self.carsOption[i].beginAngle;
                    self.cars[i].body.setZeroVelocity();
                    self.cars[i].body.setZeroDamping();
                    self.cars[i].body.x = self.carsOption[i].beginX;
                    self.cars[i].body.y = self.carsOption[i].beginY;
                }

                self.ball.body.x = 640;
                self.ball.body.y = 512;
                self.ball.body.angle = 0;
                self.ball.body.velocity.x = 0;
                self.ball.body.velocity.y = 0;
                self.ball.body.angularVelocity = 0;

                // re enabling scoring as ball location is reset and goal points are handled
                self.enableScoring = true;
            }, 3000)
        }
    },

    setInputs: function () {
        var self = this;

        var inputOne = {
            "up": game.input.keyboard.addKey(Phaser.Keyboard.W).isDown,
            "down": game.input.keyboard.addKey(Phaser.Keyboard.S).isDown,
            "left": game.input.keyboard.addKey(Phaser.Keyboard.A).isDown,
            "right": game.input.keyboard.addKey(Phaser.Keyboard.D).isDown,
            "white": game.input.keyboard.addKey(Phaser.Keyboard.U).isDown,
            "green": game.input.keyboard.addKey(Phaser.Keyboard.J).isDown,
            "black": game.input.keyboard.addKey(Phaser.Keyboard.I).isDown,
            "blue1": game.input.keyboard.addKey(Phaser.Keyboard.K).isDown,
            "blue2": game.input.keyboard.addKey(Phaser.Keyboard.O).isDown,
            "blue3": game.input.keyboard.addKey(Phaser.Keyboard.L).isDown,
            "side": game.input.keyboard.addKey(Phaser.Keyboard.Z).isDown
        };
        var inputTwo = {
            "up": game.input.keyboard.addKey(Phaser.Keyboard.UP).isDown,
            "down": game.input.keyboard.addKey(Phaser.Keyboard.DOWN).isDown,
            "left": game.input.keyboard.addKey(Phaser.Keyboard.LEFT).isDown,
            "right": game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).isDown,
            "white": game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_7).isDown,
            "green": game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_4).isDown,
            "black": game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_8).isDown,
            "blue1": game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_5).isDown,
            "blue2": game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_9).isDown,
            "blue3": game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_6).isDown,
            "side": game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_3).isDown
        };

        // Override with bot commands if number of human players is one
        if (self.humanPlayers === 1) {
            inputTwo = self.determineBotInput();
        }
        return [inputOne, inputTwo];
    },
    determineBotInput: function () {
        var self = this;

        var output = {
            "up": false,
            "down": false,
            "left": false,
            "right": false,
            "white": false,
            "green": true, //accelerate
            "black": false, //brake/reverse
            "blue1": false,
            "blue2": false,
            "blue3": false
        };

        // set ball location and angle relative from cars[1]
        var diffX = self.ball.x - self.cars[1].x;
        var diffY = self.ball.y - self.cars[1].y;
        var ballLocationAngle = Math.atan(Math.abs(diffX) / Math.abs(diffY)) * (180 / Math.PI);
        // get correct angle for ball below car
        if (diffY > 0) ballLocationAngle = 180 - ballLocationAngle;
        // get correct angle for ball left of car
        if (diffX < 0) ballLocationAngle *= -1;
        var diffAngle = ballLocationAngle - self.cars[1].angle;

        var ballDirectionAngle = Math.atan(Math.abs(self.ball.body.velocity.x) / Math.abs(self.ball.body.velocity.y)) * (180 / Math.PI);
        // get correct angle for ball below car
        if (self.ball.body.velocity.x > 0) ballDirectionAngle = 180 - ballDirectionAngle;
        // get correct angle for ball left of car
        if (self.ball.body.velocity.y < 0) ballDirectionAngle *= -1;

        // Set goal location and angle relative from cars[1]
        var goalDiffX = 1200 - self.cars[1].x;
        var goalDiffY = 512 - self.cars[1].y;
        var goalLocationAngle = Math.atan(Math.abs(goalDiffX) / Math.abs(goalDiffY)) * (180 / Math.PI);
        if (goalDiffY > 0) goalLocationAngle = 180 - goalLocationAngle;
        // get correct angle for ball left of car
        if (goalDiffX < 0) goalLocationAngle *= -1;
        var goalDiffAngle = goalLocationAngle - self.cars[1].angle;

        if (self.cars[1].hitWall) { // when car is stuck, car contact with body
            self.cars[1].stuckCount++;

            output.green = false;
            output.black = true;

            // if max repeat reached, reset
            if (self.cars[1].stuckCount > 60) {
                self.cars[1].hitWall = false;
            }
        } else if (self.ball.x > 800) { // ball close to own goal   
            if (diffAngle < 180 && diffAngle > 0) {
                // go right
                output.right = true;
                output.left = false;
            } else {
                // go left
                output.right = false;
                output.left = true;
            }
        } else if (self.cars[1].x > 1000) { // if car is close to own wall
            if (self.cars[1].angle > 0 && self.cars[1].angle < 90 || self.cars[1].angle < 0 && self.cars[1].angle > -90) {
                output.right = false;
                output.left = true;
            } else {
                output.right = true;
                output.left = false;
            }
        } else if (self.checkIfBallBetweenCarAndGoal()) { // if ball located between car and goal
            if (diffAngle < 180 && diffAngle > 0) {
                // go right
                output.right = true;
                output.left = false;
            } else {
                // go left
                output.right = false;
                output.left = true;
            }
        } else { // else drive back to goal
            if (goalDiffAngle < 180 && goalDiffAngle > 0) {
                // go right
                output.right = true;
                output.left = false;
            } else {
                // go left
                output.right = false;
                output.left = true;
            }
        }

        return output;
    },
    checkIfBallBetweenCarAndGoal: function () {
        var self = this;

        // Goal location data
        var goalTopX = 80;
        var goalTopY = 312;
        var goalBottomX = 80;
        var goalBottomY = 712;

        var line1 = self.getLineFunction(goalTopX, goalTopY, self.ball.x, self.ball.y);
        var line2 = self.getLineFunction(goalBottomX, goalBottomY, self.ball.x, self.ball.y);

        var line1Y = line1.a * self.cars[1].x + line1.b;
        var line2Y = line2.a * self.cars[1].x + line2.b;

        // line1Y < line2Y, so car > line2Y && car < line1Y
        if (self.cars[1].y < line1Y && self.cars[1].y > line2Y) {
            return true;
        } else {
            return false;
        }
    },
    getLineFunction: function (x1, y1, x2, y2) {
        // y = a * x + b
        var a = (y2 - y1) / (x2 - x1);
        var b = y1 - (a * x1);
        return { a, b };
    },
    /**
     * Function to update player actions
     * @param i index of player
     * @param controls object with control actions
     */
    updatePlayer: function (i, controls) {
        var self = this;

        /*Update Velocity*/
        if (self.velocity[i] > 9) {
            // Forward Movement
            if (controls.green && self.velocity[i] <= 600) {
                // Accelerate
                self.velocity[i] += 9;
            } else if (controls.black) {
                // Break
                self.velocity[i] -= 24;
            } else {
                // decelerate (friction)
                self.velocity[i] -= 6
            }
        } else if (self.velocity[i] < -9) {
            // Backwards Movement
            if (controls.green) {
                // Break
                self.velocity[i] += 24;
            } else if (controls.black && self.velocity[i] >= -300) {
                // Accelerate
                self.velocity[i] -= 9;
            } else {
                // decelerate (friction)
                self.velocity[i] += 6
            }
        } else {
            if (controls.green) {
                // Accelerate
                self.velocity[i] += 9;
            } else if (controls.black) {
                // Accelerate
                self.velocity[i] -= 9;
            } else {
                self.velocity[i] = 0;
            }
        }

        /*Set X and Y Speed of Velocity 1*/
        self.cars[i].body.velocity.x = self.velocity[i] * Math.cos((self.cars[i].angle - 90) * 0.01745);
        self.cars[i].body.velocity.y = self.velocity[i] * Math.sin((self.cars[i].angle - 90) * 0.01745);

        /*Rotation of Car*/
        if (controls.left) {
            if (controls.white) {
                self.cars[i].body.angularVelocity = -5 * (self.velocity[i] / 300);
            } else {
                self.cars[i].body.angularVelocity = -5 * (self.velocity[i] / 600);
            }
        } else if (controls.right) {
            if (controls.white) {
                self.cars[i].body.angularVelocity = 5 * (self.velocity[i] / 300);
            } else {
                self.cars[i].body.angularVelocity = 5 * (self.velocity[i] / 600);
            }
        } else {
            self.cars[i].body.angularVelocity = 0;
        }

    },
    constrainBallVelocity: function (sprite, maxVelocity) {
        if (!sprite || !sprite.body) { return; }
        var body = sprite.body
        var angle, currVelocitySqr, vx, vy;
        vx = body.data.velocity[0];
        vy = body.data.velocity[1];
        currVelocitySqr = vx * vx + vy * vy;
        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(vy, vx);
            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;
            body.data.velocity[0] = vx;
            body.data.velocity[1] = vy;
        }
        // console.log("BallVelocity: ",currVelocitySqr);
    },
    update: function () {
        var self = this;
        var inputs = self.setInputs();

        var player1controls = inputs[0];
        var player2controls = inputs[1];

        /**
         * Call functions to update for each player
         */
        if (self.enableScoring) {
            self.updatePlayer(0, player1controls);
            self.updatePlayer(1, player2controls);
        } else {
            self.velocity[0] = 0;
            self.velocity[1] = 0;
        }
        self.constrainBallVelocity(self.ball, 1024);

    }
};
