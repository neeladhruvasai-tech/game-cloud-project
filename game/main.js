const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload, create, update }
};

let player;
let stars;
let cursors;
let score = 0;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('star', 'assets/star.png');
}

function create() {
    // Background so stars are visible
    this.cameras.main.setBackgroundColor('#1a1a1a');

    // Player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);

    // Keyboard controls
    cursors = this.input.keyboard.createCursorKeys();

    // Stars (spawn in middle)
    stars = this.physics.add.group({
        key: 'star',
        repeat: 5,
        setXY: { x: 100, y: 300, stepX: 120 }
    });

    stars.children.iterate(child => {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
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
