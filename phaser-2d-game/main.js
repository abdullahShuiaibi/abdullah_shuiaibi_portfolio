var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var look_direction = 1;
const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600
const hp_Box_width = 200
var temp_hp_Bar;
var hp_increment = 0;
var button;
var starCount = 12;
var env_music;
var bomb_level = 0;
class SceneA extends Phaser.Scene {
	constructor(){
		super({key: 'GameScene'})
	}
	preload ()
	{
		this.load.image('sky', 'assets/sky.png');
		this.load.image('backdrop', 'assets/backdrop.png');   
		this.load.image('ground', 'assets/platform.png');
		this.load.image('star', 'assets/star.png');
		this.load.image('bomb', 'assets/bomb.png');
		this.load.spritesheet('ninja4', 'assets/ninja.png', { frameWidth: 41, frameHeight: 44 });
		this.load.audio('background_music', 'audio/game_background.mp3');﻿
		this.load.audio('item_collection_music', 'audio/game_item_collection.mp3');﻿
		this.load.image('cat_particle', 'assets/cat_particle.png');
		this.load.image("bullet", "assets/bullet.png");
		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(240, 270, 320, 50);
		var width = this.cameras.main.width;
		var height = this.cameras.main.height;
		var loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px monospace',
				fill: '#ffffff'
			}
		});
		loadingText.setOrigin(0.5, 0.5);
		this.load.on('progress', function (value) {
			console.log(value);
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(250, 280, 300 * value, 30);
		});            
		this.load.on('fileprogress', function (file) {
			console.log(file.src);
		});
		this.load.on('complete', function () {
		
			progressBar.destroy();
			progressBox.destroy();
		});
	}
	shoot(pointer) {
		var bullet_speed = 200;
		var bullet_position_correction = 40;
        var bullet = this.bullets.get(player.x + (look_direction * bullet_position_correction), player.y);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setScale(0.1);
            bullet.body.velocity.x = look_direction * bullet_speed;
            bullet.body.setAllowGravity﻿(false);
        }
    }
	create ()
	{
		 this.key_o = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
		 this.key_p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
		env_music = this.sound.add('background_music');
		env_music.setLoop(true);
		env_music.setVolume(0.5); 
		env_music.play();
		var background2 = this.add.image(400, 300, 'sky');
		background2.setScale(4);
		var backdrop = this.add.image(400, 300, 'backdrop');
		backdrop.setScale(4);
		this.bullets = this.physics.add.group({
		            defaultKey: 'bullet',
		            maxSize: 10
		        });
		this.input.on('pointerdown', function(){
			var bullet_speed = 200;
			var bullet_position_correction = 40;
	        var bullet = this.bullets.get(player.x + (look_direction * bullet_position_correction), player.y);
	        if (bullet) {
	            bullet.setActive(true);
	            bullet.setVisible(true);
	            bullet.setScale(0.1);
	            bullet.body.velocity.x = look_direction * bullet_speed;
	            bullet.body.setAllowGravity﻿(false);
				this.physics.add.overlap(bullet, bombs, this.collideBomb, null, this);
	        }
	    }, this);
		platforms = this.physics.add.staticGroup();
		platforms.create(400, 570, 'ground').setScale(2,1).refreshBody();
		platforms.create(600, 400, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 220, 'ground');
		player = this.physics.add.sprite(100, 450, 'ninja4');
		var particles = this.add.particles('cat_particle');
		var emitter = particles.createEmitter();
		emitter.setSpeed(200);
		emitter.setScale(0.05);
		emitter.setBlendMode(Phaser.BlendModes.MULTIPLY);
		emitter.startFollow(player);
		emitter.explode(20);
		this.time.delayedCall(3000, function() {
		    particles.destroy();
		});
		player.setBounce(0.2);
		player.setCollideWorldBounds(true);
		player.setScale(1.4);
		player.setSize(30, 42);
		player.setOffset(4, 3);

		var minimapCamera = this.cameras.add(DEFAULT_WIDTH - hp_Box_width - 16, DEFAULT_HEIGHT - hp_Box_width / 2 - 16, 200, 100);
		minimapCamera.zoom = 0.5;
		
		minimapCamera.startFollow(player);

	    this.cameras.main.setBounds(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

    	this.cameras.main.startFollow(player);
    	this.cameras.main.setZoom(1.5);

    	this.cameras.main.setBackgroundColor('#ccccff'); 
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('ninja4', { start: 5, end: 5 }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('ninja4', { start: 7, end: 7 }),
			frameRate: 10,
			repeat: -1
		});

		
		this.anims.create({
			key: 'turn_left',
			frames: this.anims.generateFrameNumbers('ninja4', { start: 4, end: 5 }),
			frameRate: 2,
	
		});
		this.anims.create({
			key: 'turn_right',
			frames: this.anims.generateFrameNumbers('ninja4', { start: 7, end: 8 }),
			frameRate: 2,
		});



		this.anims.create({
			key: 'taunt_left',
			frames: this.anims.generateFrameNumbers('ninja4', { start: 4, end: 5 }),
			frameRate: 4,
			repeat: 2
		});

		this.anims.create({
			key: 'taunt_right',
			frames: this.anims.generateFrameNumbers('ninja4', { start: 8, end: 12 }),
			frameRate: 4,
			repeat: 1
		});

		cursors = this.input.keyboard.createCursorKeys();
		stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: starCount, y: 0, stepX: 70 }
		});

		stars.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
			child.setScale(0.3);

		});

		bombs = this.physics.add.group();
		this.physics.add.collider(player, platforms);
		this.physics.add.collider(stars, platforms);
		this.physics.add.collider(bombs, platforms);

		this.physics.add.overlap(player, stars, this.collectStar, null, this);

		this.physics.add.collider(player, bombs, this.hitBomb, null, this);


	}

	update ()
	{

        this.bullets.children.each(function(b) {
            if (b.active) {
                if (b.x < 0 || b.x > DEFAULT_WIDTH) {
                    b.setActive(false);
                }
            }
        }.bind(this));



		if (gameOver)
		{
			gameOver = false;
			hp_increment = 0;
			score = 0;
			env_music.stop();


			return;
		}

		if (cursors.left.isDown)
		{
			player.setVelocityX(-160);

			player.anims.play('left', true);

			look_direction = -1;
		}


		else if (cursors.right.isDown)
		{
			player.setVelocityX(160);

			player.anims.play('right', true);

			look_direction = 1;
		}


		else if (this.key_o.isDown) {

			player.anims.play('taunt_left', true);
		}
		else if (this.key_p.isDown) {
		

			player.anims.play('taunt_right', true);
		}

		else
		{
			player.setVelocityX(0);

			if(look_direction == 1){
				player.anims.play('turn_right', true);	
			}
			else if(look_direction == -1){
				player.anims.play('turn_left', true);	
			}
			else{

			}


		}

		if (cursors.up.isDown && player.body.touching.down)
		{
			player.setVelocityY(-330);
		}


	}



	collideBomb (bullet, bomb)
	{
		
		bomb.destroy();
		bullet.destroy();
	}



	collectStar (player, star)
	{
		star.disableBody(true, true);

	
		score += 10;
		scoreText.setText('Score: ' + score);

		localStorage.setItem('score', score);

		temp_hp_Bar.clear();
		temp_hp_Bar.fillStyle(0xffffff, 1);


		hp_increment += 15;

		temp_hp_Bar.fillRect(DEFAULT_WIDTH - hp_Box_width - 12, 22, hp_increment , 20);
		

		var item_music = this.sound.add('item_collection_music');
	
		item_music.setVolume(0.4); 
		item_music.play();


		if (stars.countActive(true) === 0)
		{
			hp_increment = 0;
			temp_hp_Bar.fillRect(DEFAULT_WIDTH - hp_Box_width - 12, 22, 0 , 20);
			bomb_level += 1;
			stars.children.iterate(function (child) {

				child.enableBody(true, child.x, 0, true, true);

			});
			var bomb_array = [];
			for (var index = 0; index < bomb_level; index++) {
				var x = (player.x < 400) ? Phaser.Math.Between(DEFAULT_WIDTH / 2, DEFAULT_WIDTH) : Phaser.Math.Between(0, DEFAULT_WIDTH / 2);
			  	bomb_array.push(bombs.create(x, 16, 'bomb'));

			  	bomb_array[index].setBounce(1);
				bomb_array[index].setCollideWorldBounds(true);
				bomb_array[index].setVelocity(Phaser.Math.Between(-200, 200), 20);
				bomb_array[index].allowGravity = false;
			}

		}
	}

	hitBomb (player, bomb)
	{
		this.physics.pause();

		player.setTint(0xff0000);

		player.anims.play('right');

		gameOver = true;

	  	this.cameras.main.shake(500); 

	  	
	  	this.time.delayedCall(1000, function() {

	    	this.scene.restart();
	  	}, [], this);

	  	localStorage.setItem('score', 0);
	}

}



class SceneB extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'UIScene', active: true });

        this.score = 0;
    }

    create ()
    {

        
		score = parseInt(localStorage.getItem('score')) || 0;
		scoreText = this.add.text(16, 16, 'Score: ' + score, { fontSize: '28px', fill: '#111' });

		var hp_Bar = this.add.graphics();
		var hp_Box = this.add.graphics();
		hp_Box.fillStyle(0x000000, 0.6);
		hp_Box.fillRect(DEFAULT_WIDTH - hp_Box_width - 16, 16, hp_Box_width - 8, 16 * 2);
		temp_hp_Bar = hp_Bar;

        let ourGame = this.scene.get('GameScene');

        ourGame.events.on('addScore', function () {

            this.score += 10;

            scoreText.setText('Score: ' + this.score);

        }, this);
    }
}


var config = {
		type: Phaser.AUTO,
		width: DEFAULT_WIDTH,
		height: DEFAULT_HEIGHT,
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 300 },
				debug: false
			}
		},
		scene: [SceneA, SceneB]
		
	};

	var game = new Phaser.Game(config);