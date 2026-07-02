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
    // Background (optional)
    this.add.rectangle(400, 300, 800, 600, 0x1a1a1a);

    // Player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();

    // Stars (spawn in middle)
    stars = this.physics.add.group({
        key: 'star',
        repeat: 7,
        setXY: { x: 80, y: 200, stepX: 100 }
    });

    // Score UI
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#ffffff'
    });

    // Collision
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

