const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: { preload, create, update }
};

let player;
let stars;
let cursors;
let score = 0;
let scoreText;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('background', 'assets/background.png'); // optional
}

function create() {
    // Temporary background so stars are visible
    this.cameras.main.setBackgroundColor('#222222');

    player = this.physics.add.sprite(400, 300, 'player');

    // Spawn stars in the middle of the screen
    stars = this.physics.add.group({
        key: 'star',
        repeat: 5,
        setXY: { x: 100, y: 300, stepX: 120 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
    });

    this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) player.setVelocityX(-200);
    if (cursors.right.isDown) player.setVelocityX(200);
    if (cursors.up.isDown) player.setVelocityY(-200);
    if (cursors.down.isDown) player.setVelocityY(200);
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    sendEvent("score", score);
}

function sendEvent(type, value) {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type,
            value,
            timestamp: Date.now(),
            playerId: "dhruva"
        })
    });
}

new Phaser.Game(config);

