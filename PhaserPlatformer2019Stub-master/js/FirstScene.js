class FirstScene extends Phaser.Scene
{
    player;
    cursors;
    bombs;
    scoreText;
    score = 0;
    ingGame = true;

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
        this.load.image("platform", "assets/platform-100.png");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png");
    }

    create()
    {
        this.physics.world.setBounds(0,0,1600,600);
        this.cameras.main.setBounds(0,0,1600,600);

        this.add.image(800,300, "hills");
        this.player = this.physics.add.sprite(700,450, "dude");
        this.player.setCollideWorldBounds(true);
        this.player.jumpCount = 0;
        this.player.setSize(30,40).setOffset(1,8);

        this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(this.player, this.platforms);
        this.platforms.create(800, 586, "groundPlatform");
        /*
        this.platforms.create(100, 500, "platform");
        this.platforms.create(300, 300, "platform");
        this.platforms.create(400, 100, "platform");
        this.platforms.create(600, 200, "platform");
        this.platforms.create(400, 500, "platform");
        this.platforms.create(200, 400, "platform");
        this.platforms.create(500, 500, "platform");
        this.platforms.create(700, 300, "platform");
        this.platforms.create(100, 180, "platform");
        */

        let perX = 0;
        let perY = 300;

        for(var i = 0; i < 18; i++)
        {
            this.platforms.create(perX, perY, "platform");
            perX += Math.random() * 250;
            perY += Math.random() * 200;

            if(perX > 1400)
            {
                perX = 0;
            }

            if(perY > 550)
            {
                perY = 200;
            }

        }

        this.stars = this.physics.add.group(
            {
                key: "star",
                repeat: 31,
                setXY:
                    {
                        x: 25,
                        y: 0,
                        stepX: 50
                    }
            }
        );


        this.stars.children.iterate(function(child)
        {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.scoreText = this.add.text(16,16,"Score: 0",{
            fontSize: "32px",
            fill: "#000"
        }).setScrollFactor(0);

        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.overlap(this.player, this.bombs, this.endGame, null, this);
        this.makeBomb();

        //----------------------------- Animations Start ------------------------------------
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
        
        // --------------------- Animations END -------------------------------
    }

    update() 
    {
        if(this.ingGame)
        {
            // move Right and left
            if (this.cursors.left.isDown)
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
            if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.jumpCount < 1)
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

    collectStar(player, star)
    {
        star.disableBody(true,true);
        
        if(((this.score + 1) % 6) == 0)
        {
            this.makeBomb();
        }
    
        this.score += 1;
        this.scoreText.setText("Score: " + this.score);

        if(this.stars.countActive(true) === 0)
        {
            this.stars.children.iterate(
                function(child)
                {
                    child.enableBody(true, child.x, 0, true, true);
                }
            );

            this.score = 0;
        }
        
        this.scoreText.setText("Score: " + this.score);
    }

    makeBomb()
    {
        let x = (this.player.x < 600) ? Phaser.Math.Between(600, 1200) : Phaser.Math.Between(0, 600);
        let bomb = this.bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }

    endGame()
    {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play("relaxPlayer");
    }
}