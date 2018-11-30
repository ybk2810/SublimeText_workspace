var ctx;
var counter=0;
var flag=true;
var name = "김영복";
var score = 0;
var enemyType = 1;
var enemyHp = 100;
var isGameOver = false;
var bgSpeed = 3;

// 배경 x 좌표
var bgY1 = 0;
var bgY2 = -800;

//
var gunShipX = 300;
var gunShipY = 300;

//
var missileX = -300;
var missileY = -300;

//
var enemyX = 300;
var enemyY = 200;

// 1.미사일 배열
var missileArray = [];
var enemyArray = [];
// 2.마우스 클릭시 현재 좌료를 가지고 있는 미사일 객체를 생성
// 3.미사일 객체를 배열에 담기
// 4.y좌표값도 감소 
// 5.배열에 있는 모든 미사일 객체를 그리기

//이미지 객체
var bgImg = new Image();
bgImg.src = "../images/space.jpg";

//캐릭터 비행기 이미지
var gunShip1 = new Image();
gunShip1.src = "../images/gunship4.png";
var gunShip2 = new Image();
gunShip2.src = "../images/gunship5.png";
var gunShip3 = new Image();
gunShip3.src = "../images/gunship6.png";
var gunShip4 = new Image();
gunShip4.src = "../images/gunship7.png";

//적비행기
var enemyShip1 = new Image();
enemyShip1.src = "../images/gunship0.png";
var enemyShip2 = new Image();
enemyShip2.src = "../images/gunship1.png";
var enemyShip3 = new Image();
enemyShip3.src = "../images/gunship2.png";
var enemyShip4 = new Image();
enemyShip4.src = "../images/gunship3.png";

//보스비행기
var bossShip1 = new Image();
bossShip1.src = "../images/gunship8.png";
var bossShip2 = new Image();
bossShip2.src = "../images/gunship9.png";
var bossShip3 = new Image();
bossShip3.src = "../images/gunship10.png";
var bossShip4 = new Image();
bossShip4.src = "../images/gunship11.png";

//미사일
var missile = new Image();
missile.src = "../images/missile1.png";

//미사일 사운드
var msissileSound = new Audio("../sounds/blaster.wav");

//비행기 폭파 사운드
var bombSound = new Audio("../sounds/Bomb.wav");

var canvas;
window.onload = function() {
	canvas = document.getElementById("myCanvas");

	canvas.onmousemove = moveGunShip;
	canvas.onmousedown = fireMissile;

	var body = document.body;
	console.dir(body);
	body.onkeydown = restart;

	ctx = canvas.getContext("2d");
	
	setInterval(drawScreen, 50);
}

function restart(event) {
	if (event.keyCode == 32) {
		if (isGameOver) {
			isGameOver = false;
			bgSpeed = 3;
			canvas.onmousemove = moveGunShip;
			canvas.onmousedown = fireMissile;
			score = 0;
		}
	}
}

function moveGunShip() {
	gunShipX = event.pageX;
	gunShipY = event.pageY;
}

function fireMissile(event) {
	msissileSound.currentTime = 0;
	msissileSound.play();

	if (flag) {
		missileX = gunShipX-25;
	} else {
		missileX = gunShipX+25;
	}
	flag = !flag;

	// 2.마우스 클릭시 현재 좌료를 가지고 있는 미사일 객체를 생성
	var m = {x: missileX, y: event.pageY}
	// 3.미사일 객체를 배열에 담기
	missileArray.push(m)
}

function makeEnemy() {
	//랜덤위치
	var pos = Math.floor(Math.random()*750);
	if(Math.floor(Math.random()*10) == 5) {
		enemyType = 2;
	}else{
		enemyType = 1;
	}

	if(enemyType == 1) {
		enemyHp = Math.random()*100;
	}else if(enemyType == 2) {
		enemyHp = Math.random()*300;
	}

	var e ={x:pos, y:-50, hp:enemyHp, type:enemyType};

	enemyArray.push(e);
}

// 피타고라스 함수
function pythagoras(x1,y1,x2,y2) {
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

// 미사일과 적 비행기의 충돌검사
function checkCollision() {
	// 미사일 배열에서 미사일 1개 꺼내기
	for(var i = 0; i < missileArray.length; i++) {
		var m = missileArray[i]
		for(var j = 0; j < enemyArray.length; j++) {
			var e = enemyArray[j];
			// 이 미사일과 적비행기와 거리측정
			var dis = pythagoras(m.x, m.y, e.x, e.y);
			// 가까우면 맞음
			if (dis < 30) {
				e.y -= 10;
				m.x = -100;
				e.hp -= 50;
				if(e.hp <= 0) {
					e.x = -100;
					bombSound.currentTime = 0;
					bombSound.play();
					if(e.type == 1) {
						score += 100;
					}else if (e.type == 2) {
						score += 500;
					}

				}
			}
		}
	}
	// 안가까우면 안맞음
	// n번 반복
}

// 내 비행기와 적 비행기의 충돌검사
function checkShipCollision() {
	for(var j = 0; j < enemyArray.length; j++) {
		var e = enemyArray[j];
		// 이 미사일과 적비행기와 거리측정
		var dis = pythagoras(gunShipX, gunShipY, e.x, e.y);
		// 가까우면 맞음
		if (dis<30) {
			console.log("맞음");
			isGameOver = true;
			bgSpeed = 0;
			canvas.onmousemove = '';
			canvas.onmousedown = '';
		}
	}
}

function checkGameOver() {
	if (isGameOver) {
		ctx.font = "90px 고딕";
		ctx.fillStyle = "red";
		ctx.fillText("GAMEOVER", 30, 150);
	}
}

function drawScreen() {
	counter++;
	bgY1 += bgSpeed;
	bgY2 += bgSpeed;

	//적 비행기 생성
	if(counter%10 == 0)makeEnemy();
	
	//충돌 체크
	checkCollision();

	//내 비행기와 척 비행기의 충돌검사
	checkShipCollision();

	ctx.drawImage(bgImg, 0, bgY1, 600, 800);
	ctx.drawImage(bgImg, 0, bgY2, 600, 800);
	if(bgY1 >= 800) {
		bgY1 = -800;
		bgY2 = 0;
	}else if(bgY2 >= 800) {
		bgY1 = 0;
		bgY2 = -800;
	}

	//비행기 그리기
	if(counter%4 == 0)ctx.drawImage(gunShip1, gunShipX-25, gunShipY-25, 50,50);
	else if(counter%4 == 1)ctx.drawImage(gunShip2 ,gunShipX-25, gunShipY-25, 50, 50);
	else if(counter%4 == 2)ctx.drawImage(gunShip3, gunShipX-25, gunShipY-25, 50, 50);
	else if(counter%4 == 3)ctx.drawImage(gunShip4, gunShipX-25, gunShipY-25, 50, 50);
	
	//미사일 그리기
	for (var i = 0; i < missileArray.length; i++) {
		var m = missileArray[i];
		m.y -= 50;
		if(m.y < -5){
			missileArray.shift();
		}
		ctx.drawImage(missile,m.x-2.5,m.y,5,15);
	}

	//적비행기 그리기
	for (var i = 0; i < enemyArray.length; i++) {
		var e = enemyArray[i];
		e.y += 5;

		if (e.type == 1){
			if(counter%4 == 0)ctx.drawImage(enemyShip1, e.x-25, e.y-25, 50, 50);
			else if(counter%4 == 1)ctx.drawImage(enemyShip2, e.x-25, e.y-25, 50, 50);
			else if(counter%4 == 2)ctx.drawImage(enemyShip3, e.x-25, e.y-25, 50, 50);
			else if(counter%4 == 3)ctx.drawImage(enemyShip4, e.x-25, e.y-25, 50, 50);
		} else if (e.type == 2){
			if(counter%4 == 0)ctx.drawImage(bossShip1, e.x-25, e.y-25, 75, 75);
			else if(counter%4 == 1)ctx.drawImage(bossShip2, e.x-25, e.y-25, 75, 75);
			else if(counter%4 == 2)ctx.drawImage(bossShip3, e.x-25, e.y-25, 75, 75);
			else if(counter%4 == 3)ctx.drawImage(bossShip4, e.x-25, e.y-25, 75, 75);
		}

		if(e.y > 600) {
			enemyArray.shift();
		}
	}

	//
	checkGameOver();

	ctx.font = "30px 고딕";
	ctx.fillStyle = "white";
	ctx.fillText("이름: " + name + ", score: " + score, 100, 50);
}	