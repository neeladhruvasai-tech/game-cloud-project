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

let player;
let stars;
let cursors;
let score = 0;
let scoreText;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('star', 'assets/star.png');
}

function create() {

    // Background color
    this.cameras.main.setBackgroundColor('#222222');

    // Create player
    player = this.physics.add.sprite(
        config.width / 2,
        config.height / 2,
        'player'
    );

    player.setScale(0.15);
    player.setCollideWorldBounds(true);

    // Keyboard
    cursors = this.input.keyboard.createCursorKeys();

    // Score text
    scoreText = this.add.text(20, 20, "Score: 0", {
        fontSize: "32px",
        color: "#ffffff"
    });

    // Create stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 5,
        setXY: {
            x: 120,
            y: 150,
            stepX: 180
        }
    });

    stars.children.iterate(function (child) {

        child.setScale(0.08);

        child.setBounceY(
            Phaser.Math.FloatBetween(0.2, 0.5)
        );

    });

    // Detect collection
    this.physics.add.overlap(
        player,
        stars,
        collectStar,
        null,
        this
    );
}

function update() {

    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-250);
    }

    if (cursors.right.isDown) {
        player.setVelocityX(250);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-250);
    }

    if (cursors.down.isDown) {
        player.setVelocityY(250);
    }
}

function collectStar(player, star) {

    star.disableBody(true, true);

    score += 10;

    scoreText.setText("Score: " + score);

    sendEvent("score", score);

    // Win condition
    if (stars.countActive(true) === 0) {

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

