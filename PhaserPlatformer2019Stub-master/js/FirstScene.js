class FirstScene extends Phaser.Scene
{
    player;
    cursors;

    constructor(config)
    {
        super(config);
    }

    preload()
    {
        this.load.image("hills", "assets/hills.jpg");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32, 
            frameHeight: 48});
        this.load.image("groundPlatform", "assets/platform-1600.png");
    }

    create()
    {
        this.add.image(800,300, "hills");
        this.player = this.physics.add.sprite(100,450, "dude");
        this.player.setCollideWorldBounds(true);
        this.player.jumpCount = 0;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(this.player, this.platforms);
        this.platforms.create(800, 586, "groundPlatform");

        this.anims.create({
            key: "leftRunPlayer",
            frames: this.anims.generateFrameNumbers("dude",
            {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "rightRunPlayer",
            frames: this.anims.generateFrameNumbers("dude",
            {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "relaxPlayer",
            frames: this.anims.generateFrameNumbers("dude",
            {
                start: 4,
                end: 4
            }),
            frameRate: 1,
            repeat: -1
        });
    }

    update()
    {
        // move Right and left
        if(this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.anims.play("leftRunPlayer", true);
        }
        else if(this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.player.anims.play("rightRunPlayer", true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play("relaxPlayer", true);
        }

        // Jump
        if(Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.jumpCount < 1)
        {
            this.player.jumpCount++;
            this.player.setVelocityY(-300);
        }

        if(this.player.body.touching.down)
        {
            this.player.jumpCount = 0;
        }
    }
}