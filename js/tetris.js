// Huge thanks to Meth Meth Method for his tutorial on programming tetris
// CheckCollision and Merge functions adapted from his work
// https://www.youtube.com/watch?v=H2aW5V46khA
// https://github.com/meth-meth-method/tetris

const game=document.querySelector('#tetris');
const holdCanvas=document.querySelector('#hold');
const nextCanvas=document.querySelector('#next');
const ctx = game.getContext('2d');
const holdCtx= holdCanvas.getContext('2d');
const nextCtx= nextCanvas.getContext('2d');
holdCtx.scale(15,15);
nextCtx.scale(15,15);

const player={
  position:{x:4,y:0},
  tetrimino:[],
  rotation:0,
  score:0
}
let player2={
  position:{x:0,y:0},
  tetrimino:[],
  rotation:0
}
let ghost={
  position:{x:0,y:0},
  tetrimino:[],
  rotation:0
};

const updatePlayer2=(dir)=>{
  player2.position=player.position;
  player2.tetrimino=player.tetrimino;
  if (dir>0){
    if(player.rotation<3){
      player2.rotation=player.rotation+dir;
    }
    else{
      player2.rotation=0;
    }
  }
  if (dir<0){
    if(player.rotation==0){
      player2.rotation=3;
    }
    else{
      player2.rotation=player.rotation+dir;
    }
  }
}

const updateGhost=()=>{
  ghost.position.x=parseInt(player.position.x);
  ghost.position.y=parseInt(player.position.y);
  ghost.tetrimino=player.tetrimino;
  ghost.rotation=player.rotation;
  while(!checkCollision(gameGrid,ghost)){
          ghost.position.y++;
      }
      ghost.position.y--;
}

// create tetriminos
const createTetri=(n)=>{
  if (n==1){
      return [[[0,1,0],
              [2,3,4],
              [0,0,0]],
              [[0,1,0],
              [0,2,4],
              [0,3,0]],
              [[0,0,0],
              [2,3,4],
              [0,1,0]],
              [[0,1,0],
              [4,2,0],
              [0,3,0]]];
  }
  else if (n==2){
      return [[[0,0,0,0],
              [0,1,2,0],
              [0,3,4,0],
              [0,0,0,0]],
              [[0,0,0,0],
              [0,4,1,0],
              [0,3,2,0],
              [0,0,0,0]],
              [[0,0,0,0],
              [0,3,4,0],
              [0,2,1,0],
              [0,0,0,0]],
              [[0,0,0,0],
              [0,2,3,0],
              [0,1,4,0],
              [0,0,0,0]]];
  }
          

  else if (n==3){
      return [[[0,0,1],
              [4,3,2],
              [0,0,0]],
              [[0,4,0],
              [0,3,0],
              [0,2,1]],
              [[0,0,0],
              [2,3,4],
              [1,0,0]],
              [[1,2,0],
              [0,3,0],
              [0,4,0]]]
  }

  else if (n==4){
      return [[[1,0,0],
              [2,3,4],
              [0,0,0]],
              [[0,2,1],
              [0,3,0],
              [0,4,0]],
              [[0,0,0],
              [4,3,2],
              [0,0,1]],
              [[0,1,0],
              [0,2,0],
              [4,3,0]]];
  }

  else if (n==5){
      return [[[0,0,0,0],
              [1,2,3,4],
              [0,0,0,0],
              [0,0,0,0]],
              [[0,0,1,0],
              [0,0,2,0],
              [0,0,3,0],
              [0,0,4,0]],
              [[0,0,0,0],
              [0,0,0,0],
              [4,3,2,1],
              [0,0,0,0]],
              [[0,1,0,0],
              [0,2,0,0],
              [0,3,0,0],
              [0,4,0,0]]];
  }
  else if (n==6){
      return [[[0,2,1],
              [4,3,0],
              [0,0,0]],
              [[0,4,0],
              [0,3,2],
              [0,0,1]],
              [[0,0,0],
              [0,3,4],
              [1,2,0]],
              [[1,0,0],
              [2,3,0],
              [0,4,0]]];
  }
  else if (n==7){
      return [[[1,2,0],
              [0,3,4],
              [0,0,0]],
              [[0,0,1],
              [0,3,2],
              [0,4,0]],
              [[0,0,0],
              [4,3,0],
              [0,2,1]],
              [[0,4,0],
              [2,3,0],
              [1,0,0]]];
  }
}
let array=[1,2,3,4,5,6,7];
let rand;
let i=6;
let next;

// fisher-yates shuffle taken from below:
// https://bost.ocks.org/mike/shuffle/
const shuffleArray=(arr)=>{
  let currentIndex = arr.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  array=arr;
}

const changeTetri=()=>{
  player.tetrimino=createTetri(array[i]);
  next=createTetri(array[i-1]);
  array.splice(i,1);
  i--;
  if(i<0){
      i=6;
      array=[1,2,3,4,5,6,7];
      shuffleArray(array);
      next=createTetri(array[i]);
  }
}

const createGrid=(w, h)=>{
  let grid = [];
  for(let i = 0; i < h; i++) {
      grid[i] = [];
      for(let j = 0; j < w; j++) {
          grid[i][j] = 0;
      }
  }
  return grid;
}

let gameGrid=createGrid(10,22);

const render=()=>{
  ctx.clearRect(0,0,game.width,game.height);
  holdCtx.clearRect(0,0,holdCanvas.width,holdCanvas.height);
  nextCtx.clearRect(0,0,nextCanvas.width,nextCanvas.height);
  renderTetri(gameGrid,{x:0,y:0});
  renderTetri(player.tetrimino[player.rotation],player.position);
  renderGhost(player.tetrimino[player.rotation],ghost.position);
  if(hold1){
    renderHold(hold1[1],{x:0,y:0});
  }
  renderNext(next[1],{x:0,y:0});
}

const reset=()=>{
  gameGrid=createGrid(10,22);
  player.position={x:4,y:0};
  player.tetrimino=[];
  player.rotation=0;
  player.score=0;
  hold1=null;
  hold2=null;
  changeTetri();
}

let lastScore=0;
const displayGameOver=()=>{
  if(player.score>lastScore){
    lastScore=player.score;
  }
  let number=document.getElementById('number');
  number.innerHTML=`High Score:<br>${lastScore}`;
}

const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];

let img1=new Image();
img1.src="images/golconda_1a.png";
let img2=new Image();
img2.src="images/golconda_2a.png";  
let img3=new Image();
img3.src="images/golconda_3a.png";
let img4=new Image();
img4.src="images/golconda_4a.png";

const renderTetri=(tetri, offset)=>{
  tetri.forEach((row,yIndex)=>{
      row.forEach((value,xIndex)=>{
          if (value!=0){
              if(value==1){
                  ctx.drawImage(img1,(xIndex+offset.x)*40,(yIndex+offset.y)*40,40,40);
              }
              else if(value==2){
                  ctx.drawImage(img2,(xIndex+offset.x)*40,(yIndex+offset.y)*40,40,40);   
              }
              else if (value==3){
                  ctx.drawImage(img3,(xIndex+offset.x)*40,(yIndex+offset.y)*40,40,40);   
              }
              else if (value==4){
                  ctx.drawImage(img4,(xIndex+offset.x)*40,(yIndex+offset.y)*40,40,40);
              }
          }
      })
  })
}

const renderHold=(tetri, offset)=>{
  tetri.forEach((row,yIndex)=>{
      row.forEach((value,xIndex)=>{
          if (value!=0){
              // render tetrimino
              holdCtx.fillStyle="black";
              holdCtx.fillRect((xIndex+offset.x),(yIndex+offset.y),1,1);
          }
      })
  })
}

const renderNext=(tetri, offset)=>{
  tetri.forEach((row,yIndex)=>{
      row.forEach((value,xIndex)=>{
          if (value!=0){
              // render tetrimino
              nextCtx.fillStyle="black";
              nextCtx.fillRect((xIndex+offset.x),(yIndex+offset.y),1,1);
          }
      })
  })
}

const renderGhost=(tetri, offset)=>{
  tetri.forEach((row,yIndex)=>{
      row.forEach((value,xIndex)=>{
          if (value!=0){
              // render tetrimino
              ctx.fillStyle='rgb(221, 221, 221, .25)';
              ctx.fillRect((xIndex+offset.x)*40,(yIndex+offset.y)*40,40,40);
          }
      })
  })
}

const softDrop=()=>{
player.position.y++;
  if(checkCollision(gameGrid,player)){
      player.position.y--;
      merge(gameGrid,player);
      clearRow();
      player.position={x:4,y:0};
      changeTetri();
      holdstate=true;
  }
}
const hardDrop=()=>{
  while(!checkCollision(gameGrid,player)){
      player.position.y++;
  }
  player.position.y--;
  merge(gameGrid,player);
  clearRow();
  player.position={x:4,y:0};
  changeTetri();
  holdstate=true;
}

const checkCollision=(gameGrid,player)=>{
  for(let y=0;y<player.tetrimino[0].length;y++){
      for(let x=0;x<player.tetrimino[0].length;x++){
          if(player.tetrimino[player.rotation][y][x]!==0&&(gameGrid[y+player.position.y]&&gameGrid[y+player.position.y][x+player.position.x])!==0){
              return true;
          }
      }
  }
  return false;
}

const merge=(gameGrid,player)=>{
player.tetrimino[player.rotation].forEach((row,yIndex)=>{
	row.forEach((value,xIndex)=>{
		if(value!=0){
			gameGrid[yIndex+player.position.y][xIndex+player.position.x]=value;
		}
	})
}
)};

const moveDir=(dir)=>{
  player.position.x+=dir;
  if(checkCollision(gameGrid,player)){
      player.position.x-=dir;
  }
}

const rotate=(dir)=>{
  updatePlayer2(dir);
  if (dir>0){
      if(!checkCollision(gameGrid,player2)){
          if(player.rotation<3){
              player.rotation+=dir;
          }
          else{
              player.rotation=0;
          }
      }
  }
  if (dir<0){
      if(!checkCollision(gameGrid,player2)){
          if(player.rotation==0){
              player.rotation=3;
          }
          else{
              player.rotation+=dir;
          }
      }
  }
}
const clearRow=()=>{
  for(row in gameGrid){
      if(gameGrid[row].every((n)=>n!=0)){
          player.score+=10;
          gameGrid.splice(row,1);
          gameGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
  }
}

let hold1=null;
let hold2=null;
let holdstate=true;
const hold=()=>{
  if (hold1==null){
      hold1=player.tetrimino;
      player.position={x:4,y:0};
      changeTetri();
      holdstate=false;
  }
  else if(holdstate){
      hold2=player.tetrimino;
      player.tetrimino=hold1;
      hold1=hold2;
      player.position={x:4,y:0};
      holdstate=false;
  }
}


let counter=0;
const update=()=>{
  counter+=60/60;
  if(counter>720/60){
  	softDrop();
  	counter=0;
  }
  updateGhost();
  document.getElementById('score').innerHTML=`Current Score:<br>${player.score}`;
  render();
  if(gameGrid[2].some((n)=>n!=0)){
      displayGameOver();
      reset();
  }
  requestAnimationFrame(update);
}

// Key Switch
document.addEventListener('keydown', e => {
  const keyCode = e.keyCode;
  if ([16,17,32,37,38, 39, 40,67,81,87,88,90].includes(keyCode)) {
    e.preventDefault();
  }
  switch (keyCode) {
    // shift or c
    case 16:
    case 67:
      hold();
      break;
    // spacebar
    case 32:
      hardDrop();
      break;
    // left arrow
    case 37:
      moveDir(-1);
      break;
    case 39:
      moveDir(1);
      break;
    // down arrow
    case 40:
      softDrop();
      break;
    // ctrl || q || z
    case 17:
    case 81:
    case 90:
      rotate(-1);
      break;
    // up arrow || w || x
    case 38:
    case 87:
    case 88:
      rotate(1);
      break;
  }
});

const startGame=()=>{
  shuffleArray(array);
  changeTetri();
  update();
  updatePlayer2(0,0);
}

startGame();