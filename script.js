const TILE_SIZE = 20;
const ROWS = 20;
const COLS = 20;

const COLORS = {
    BG: '#050510',
    WALL: '#1a1a3a',
    WALL_BORDER: '#00f3ff',
    PACMAN: '#ffee00',
    GHOST: '#ff00ff',
    DOT: '#ffffff'
};

const MAP_LAYOUT = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
    STOP: { x: 0, y: 0 }
};

class Pacman {
    constructor(x, y, tileSize, map) {
        this.tileSize = tileSize;
        this.x = x * tileSize;
        this.y = y * tileSize;
        this.map = map;
        this.direction = DIRECTIONS.STOP;
        this.nextDirection = DIRECTIONS.STOP;
        this.speed = 2; // Pixels per frame
        this.radius = tileSize / 2 - 2;
    }

    update() {
        // Try to change direction if queued
        if (this.nextDirection !== DIRECTIONS.STOP) {
            if (this.canMove(this.nextDirection)) {
                // Only turn if we are roughly centered on a tile to avoid getting stuck
                if (this.isCentered()) {
                    this.direction = this.nextDirection;
                    this.nextDirection = DIRECTIONS.STOP;
                }
            }
        }

        // Move in current direction if possible
        if (this.canMove(this.direction)) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;

            // Wrap around screen (teleport)
            if (this.x < 0) this.x = this.canvasWidth - this.tileSize;
            if (this.x > this.canvasWidth) this.x = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = COLORS.PACMAN;
        ctx.beginPath();

        const centerX = this.x + this.tileSize / 2;
        const centerY = this.y + this.tileSize / 2;

        // Simple mouth animation based on direction could go here, 
        // for now just a full circle or basic wedge
        let angle = 0;
        if (this.direction === DIRECTIONS.RIGHT) angle = 0;
        if (this.direction === DIRECTIONS.DOWN) angle = Math.PI / 2;
        if (this.direction === DIRECTIONS.LEFT) angle = Math.PI;
        if (this.direction === DIRECTIONS.UP) angle = -Math.PI / 2;

        // Draw Pacman as a circle with a mouth
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, this.radius, angle + 0.2, angle + (Math.PI * 2) - 0.2);
        ctx.fill();
    }

    canMove(dir) {
        // Calculate the checking position based on direction
        // We look ahead to the next tile's center

        let checkX = this.x + (this.tileSize / 2) + (dir.x * (this.tileSize / 2 + 1));
        let checkY = this.y + (this.tileSize / 2) + (dir.y * (this.tileSize / 2 + 1));

        let col = Math.floor(checkX / this.tileSize);
        let row = Math.floor(checkY / this.tileSize);

        // Boundary checks
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;

        return this.map[row][col] !== 1;
    }

    isCentered() {
        // Check if aligned with the grid strictly enough to turn
        // Tolerance of speed/2
        const centerX = this.x + this.tileSize / 2;
        const centerY = this.y + this.tileSize / 2;
        return (
            Math.abs(centerX % this.tileSize - this.tileSize / 2) < this.speed &&
            Math.abs(centerY % this.tileSize - this.tileSize / 2) < this.speed
        );
    }

    // Helper to snap to grid when turning for precise movement
    snapToGrid() {
        const col = Math.round(this.x / this.tileSize);
        const row = Math.round(this.y / this.tileSize);
        this.x = col * this.tileSize;
        this.y = row * this.tileSize;
    }
}

class Ghost {
    constructor(x, y, tileSize, color, map) {
        this.tileSize = tileSize;
        this.x = x * tileSize;
        this.y = y * tileSize;
        this.color = color;
        this.map = map;
        this.direction = DIRECTIONS.RIGHT;
        this.speed = 2;
        this.radius = tileSize / 2 - 2;

        // Timer to change direction occasionally so they don't get stuck just bouncing
        this.changeDirTimer = 0;
    }

    update() {
        // Move
        if (this.canMove(this.direction)) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;
        } else {
            // Hit a wall, pick a new random direction
            this.changeDirection();
        }

        // At intersections (centered on tile), potentially change direction to make it more dynamic
        if (this.isCentered()) {
            if (this.changeDirTimer > 0) this.changeDirTimer--;

            // 20% chance to change direction at an intersection even if not blocked, to make movement unpredictable
            if (this.changeDirTimer === 0 && Math.random() < 0.2) {
                this.changeDirection();
                this.changeDirTimer = 10; // Cooldown
            }
        }

        // Wrap
        if (this.x < 0) this.x = this.canvasWidth - this.tileSize;
        if (this.x > this.canvasWidth) this.x = 0;
    }

    changeDirection() {
        const possibleDirs = [];
        if (this.canMove(DIRECTIONS.UP)) possibleDirs.push(DIRECTIONS.UP);
        if (this.canMove(DIRECTIONS.DOWN)) possibleDirs.push(DIRECTIONS.DOWN);
        if (this.canMove(DIRECTIONS.LEFT)) possibleDirs.push(DIRECTIONS.LEFT);
        if (this.canMove(DIRECTIONS.RIGHT)) possibleDirs.push(DIRECTIONS.RIGHT);

        if (possibleDirs.length > 0) {
            // Pick random valid direction
            const randIndex = Math.floor(Math.random() * possibleDirs.length);
            this.direction = possibleDirs[randIndex];
        } else {
            // Trapped (shouldn't happen in this map) but reverse just in case
            this.direction = { x: -this.direction.x, y: -this.direction.y };
        }
    }

    canMove(dir) {
        let checkX = this.x + (this.tileSize / 2) + (dir.x * (this.tileSize / 2 + 1));
        let checkY = this.y + (this.tileSize / 2) + (dir.y * (this.tileSize / 2 + 1));
        let col = Math.floor(checkX / this.tileSize);
        let row = Math.floor(checkY / this.tileSize);

        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;
        return this.map[row][col] !== 1;
    }

    isCentered() {
        const centerX = this.x + this.tileSize / 2;
        const centerY = this.y + this.tileSize / 2;
        return (
            Math.abs(centerX % this.tileSize - this.tileSize / 2) < this.speed &&
            Math.abs(centerY % this.tileSize - this.tileSize / 2) < this.speed
        );
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const centerX = this.x + this.tileSize / 2;
        const centerY = this.y + this.tileSize / 2;

        // Draw ghost body (circle top, rect bottom)
        ctx.arc(centerX, centerY - 2, this.radius, Math.PI, 0);
        ctx.lineTo(centerX + this.radius, centerY + this.radius);
        ctx.lineTo(centerX - this.radius, centerY + this.radius);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(centerX - 4, centerY - 4, 3, 0, Math.PI * 2);
        ctx.arc(centerX + 4, centerY - 4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(centerX - 4 + (this.direction.x * 1.5), centerY - 4 + (this.direction.y * 1.5), 1.5, 0, Math.PI * 2);
        ctx.arc(centerX + 4 + (this.direction.x * 1.5), centerY - 4 + (this.direction.y * 1.5), 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.map = MAP_LAYOUT;

        // Initialize Pacman at (1, 1)
        this.pacman = new Pacman(1, 1, TILE_SIZE, this.map);
        // Inject canvas width for wrap-around
        this.pacman.canvasWidth = this.canvas.width;

        // Initialize Ghosts
        this.ghosts = [
            new Ghost(9, 8, TILE_SIZE, COLORS.GHOST, this.map), // Center area
            new Ghost(10, 8, TILE_SIZE, "#ff0000", this.map),   // Red
            new Ghost(9, 9, TILE_SIZE, "#00ff00", this.map)     // Green
        ];
        this.ghosts.forEach(g => g.canvasWidth = this.canvas.width);

        // Bind methods to this instance
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.loop = this.loop.bind(this);
        this.handleInput = this.handleInput.bind(this);

        this.lastTime = 0;

        document.addEventListener('keydown', this.handleInput);

        requestAnimationFrame(this.loop);
    }

    handleInput(e) {
        switch (e.key) {
            case 'ArrowUp':
                this.pacman.nextDirection = DIRECTIONS.UP;
                break;
            case 'ArrowDown':
                this.pacman.nextDirection = DIRECTIONS.DOWN;
                break;
            case 'ArrowLeft':
                this.pacman.nextDirection = DIRECTIONS.LEFT;
                break;
            case 'ArrowRight':
                this.pacman.nextDirection = DIRECTIONS.RIGHT;
                break;
        }
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.loop);
    }

    update(deltaTime) {
        this.pacman.update();
        this.checkCoinCollision();

        // Update ghosts
        this.ghosts.forEach(ghost => ghost.update());

        this.checkGhostCollision();
    }

    checkCoinCollision() {
        // Center of pacman
        const centerCol = Math.floor((this.pacman.x + TILE_SIZE / 2) / TILE_SIZE);
        const centerRow = Math.floor((this.pacman.y + TILE_SIZE / 2) / TILE_SIZE);

        if (this.map[centerRow][centerCol] === 0) {
            this.map[centerRow][centerCol] = 2; // 2 = Eaten/Empty
            this.score += 10;
            // Assuming there's an element with id 'score' to display it
            document.getElementById('score').innerText = this.score;
        }
    }

    checkGhostCollision() {
        // Simple bounding box collision
        const pRect = { x: this.pacman.x + 4, y: this.pacman.y + 4, w: TILE_SIZE - 8, h: TILE_SIZE - 8 };

        for (let ghost of this.ghosts) {
            const gRect = { x: ghost.x + 4, y: ghost.y + 4, w: TILE_SIZE - 8, h: TILE_SIZE - 8 };

            if (pRect.x < gRect.x + gRect.w &&
                pRect.x + pRect.w > gRect.x &&
                pRect.y < gRect.y + gRect.h &&
                pRect.y + pRect.h > gRect.y) {
                this.gameOver();
            }
        }
    }

    gameOver() {
        // Simple restart for now
        alert("GAME OVER! Score: " + this.score);
        document.location.reload();
    }

    draw() {
        // Clear screen
        this.ctx.fillStyle = COLORS.BG;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Map
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = this.map[r][c];
                const x = c * TILE_SIZE;
                const y = r * TILE_SIZE;

                if (cell === 1) {
                    this.drawWall(x, y);
                } else if (cell === 0) {
                    this.drawDot(x, y);
                }
            }
        }

        // Draw Pacman
        this.pacman.draw(this.ctx);
        this.ghosts.forEach(g => g.draw(this.ctx));
    }

    drawWall(x, y) {
        this.ctx.fillStyle = COLORS.WALL;
        this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        // Add a neon border effect
        this.ctx.strokeStyle = COLORS.WALL_BORDER;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    }

    drawDot(x, y) {
        this.ctx.fillStyle = COLORS.DOT;
        this.ctx.beginPath();
        this.ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
