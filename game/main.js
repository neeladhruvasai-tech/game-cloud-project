const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade' },
    scene: { preload, create, update }
};

let player;
let stars;
let score = 0;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('star', 'assets/star.png');
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
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) player.x -= 5;
    if (cursors.right.isDown) player.x += 5;
    if (cursors.up.isDown) player.y -= 5;
    if (cursors.down.isDown) player.y += 5;
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

