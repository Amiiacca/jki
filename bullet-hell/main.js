import kaplay from "https://unpkg.com/kaplay@3001.0.0-alpha.18/dist/kaplay.mjs";

// Initialize our game
kaplay({
    // set the background to black (ish)
    background: [240, 245, 255],
    // Basically just make the pixels more crisp
    crisp: true,
});

/* Load Assets here */
loadSprite("guy", "assets/sprites/player.png", {
    sliceX: 5,
    sliceY: 3,
    anims: {
        idle: { from: 0, to: 3, speed: 5, loop: true },
        run: { from: 4, to: 13, speed: 10, loop: true },
    },
});
loadSprite("kboom", "assets/sprites/explosion.png", {
    sliceX: 5,
    sliceY: 1,
    anims: {
        boom: { from: 0, to: 4, speed: 15 },
    },
});
loadSprite("bullets", "assets/sprites/bullets.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
        gun: { from: 0, to: 1, speed: 5 },
    },
});
loadSprite("gun", "assets/sprites/gun.png");

scene("main", () => {
    const player = add([
        sprite("guy", { anim: "idle" }),
        scale(0.2),
        area(),
        pos(width() / 2, height() / 2),
        anchor("center"),
        {
            running: false,
        },
    ]);

    // Runs each frame, but only manages player's actions.
    player.onUpdate(() => {
        // Handle animations
        const anim = player.curAnim();
        if (player.running) {
            // If the player is RUNNING but it's not playing the run animation, play it.
            if (anim !== "run") {
                player.play("run");
            }
        } else {
            // If the player is NOT RUNNING but it's playing the run animation,
            // play the idle animation.
            if (anim !== "idle") {
                player.play("idle");
            }
        }
    });

    onKeyDown(["a"], () => {
        player.move(-200, 0);
        player.flipX = true;
    });
    onKeyDown("d", () => {
        player.move(200, 0);
        player.flipX = false;
    });
    onKeyDown(["w"], () => {
        player.move(0, -200);
    });
    onKeyDown("s", () => {
        player.move(0, 200);
    });

    // Tells the player that it is currently running.
    onKeyDown(["a", "s", "d", "w"], () => {
        player.running = true;
    });
    // Not running anymore.
    onKeyRelease(["a", "s", "d", "w"], () => {
        player.running = false;
    });

    const gun = add([
        sprite("gun"),
        pos(player.pos),
        rotate(0),
        scale(0.2),
        anchor("center"),
    ]);

    // Same as player.onUpdate() but this time with the gun object.
    gun.onUpdate(() => {
        // Fix position
        gun.pos = player.pos.add(15, 15);
        // Some trigonometry to find the angle of the mouse
        gun.angle = rad2deg(
            Math.atan2(mousePos().y - gun.pos.y, mousePos().x - gun.pos.x),
        );
    });

    onClick(() => {
        // Add an explosion as a child of the gun object.
        gun.add([
            sprite("kboom", { anim: "boom" }),
            pos(0, 0),
            scale(2),
            opacity(1),
            lifespan(0.3),
            anchor(vec2(-1, 0)),
        ]);
    });
});

go("main");
