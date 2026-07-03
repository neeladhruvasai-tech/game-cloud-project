const GAME = {
    PLAYER_SPEED: 250,
    PLAYER_SCALE: 0.15,
    OBJECT_SCALE: 0.08,
    START_TIME: 60,
    STAR_POINTS: 10
};
const config = {
    type: Phaser.AUTO,

    width: window.innerWidth,
    height: window.innerHeight,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: {
        preload,
        create,
        update
    }
};
let background;
let player;
let energyCrystals;
let cursors;
let score = 0;
let scoreText;

function preload() {
    this.load.image(
    'background',
    'assets/backgrounds/background.jpg'
    );
    this.load.image('player', 'assets/player.png');
    this.load.image('star', 'assets/star.png');
}

function create() {
    background = this.add.image(config.width / 2, config.height / 2, 'background');

    // Scale to COVER the entire canvas (no distortion, no gaps)
    const scaleX = config.width / background.width;
    const scaleY = config.height / background.height;
    const scale = Math.max(scaleX, scaleY); // use the LARGER ratio to fully cover
    background.setScale(scale);
    background.setDepth(-1);

    console.log('Background texture size:', background.width, background.height);
    console.log('Canvas size:', config.width, config.height);
    console.log('Applied scale:', scale);
    // Create player
    player = this.physics.add.sprite(
        config.width / 2,
        config.height / 2,
        'player'
    );
    player.setScale(GAME.PLAYER_SCALE);
    player.setCollideWorldBounds(true);

    // Keyboard
    cursors = this.input.keyboard.createCursorKeys();

    // Score text
    scoreText = this.add.text(20, 20, "Score: 0", {
        fontSize: "32px",
        color: "#ffffff"
    });

    // Create energyCrystals
    energyCrystals = this.physics.add.group({
        key: 'star',
        repeat: 5,
        setXY: {
            x: 120,
            y: 150,
            stepX: 180
        }
    });

    energyCrystals.children.iterate(function (child) {

        child.setScale(GAME.OBJECT_SCALE);

        child.setBounceY(
            Phaser.Math.FloatBetween(0.2, 0.5)
        );

    });

    // Detect collection
    this.physics.add.overlap(
        player,
        energyCrystals,
        collectEnergyCrystal,
        null,
        this
    );
}

function update() {

    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-GAME.PLAYER_SPEED);
    }

    if (cursors.right.isDown) {
        player.setVelocityX(+GAME.PLAYER_SPEED);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-GAME.PLAYER_SPEED);
    }

    if (cursors.down.isDown) {
        player.setVelocityY(+GAME.PLAYER_SPEED);
    }
}

function collectEnergyCrystal(player, energyCrystal) {

    energyCrystal.disableBody(true, true);

    score += GAME.STAR_POINTS;

    scoreText.setText("Score: " + score);

    sendEvent("score", score);

    // Win condition
    if (energyCrystals.countActive(true) === 0) {

        this.add.text(
            config.width / 2 - 120,
            config.height / 2,
            "YOU WIN!",
            {
                fontSize: "48px",
                color: "#00ff00"
            }
        );

        player.disableBody(true, true);

        sendEvent("game_complete", score);
    }
}

function sendEvent(type, value) {

    if (typeof API_URL === "undefined") {
        console.log("API_URL not defined");
        return;
    }

    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            type,
            value,
            timestamp: Date.now(),
            playerId: "dhruva"

        })

    }).catch(console.error);

}

new Phaser.Game(config);

