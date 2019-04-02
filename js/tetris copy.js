const canvas=document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.scale(20,20);

const player={
    position:{x:4,y:0},
    tetrimino:[[[0,1,0],
                [1,1,1],
                [0,0,0]],
                [[0,1,0],
                [0,1,1],
                [0,1,0]],
                [[0,0,0],
                [1,1,1],
                [0,1,0]],
                [[0,1,0],
                [1,1,0],
                [0,1,0]]],
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
                [1,1,1],
                [0,0,0]],
                [[0,1,0],
                [0,1,1],
                [0,1,0]],
                [[0,0,0],
                [1,1,1],
                [0,1,0]],
                [[0,1,0],
                [1,1,0],
                [0,1,0]]];
    }
    else if (n==2){
        return [[[2,2],
                [2,2]],
                [[2,2],
                [2,2]],
                [[2,2],
                [2,2]],
                [[2,2],
                [2,2]]];
    }
    else if (n==3){
        return [[[0,0,3],
                [3,3,3],
                [0,0,0]],
                [[0,3,0],
                [0,3,0],
                [0,3,3]],
                [[0,0,0],
                [3,3,3],
                [3,0,0]],
                [[3,3,0],
                [0,3,0],
                [0,3,0]]]
    }

    else if (n==4){
        return [[[4,0,0],
                [4,4,4],
                [0,0,0]],
                [[0,4,4],
                [0,4,0],
                [0,4,0]],
                [[0,0,0],
                [4,4,4],
                [0,0,4]],
                [[0,4,0],
                [0,4,0],
                [4,4,0]]];
    }

    else if (n==5){
        return [[[0,0,0,0],
                [5,5,5,5],
                [0,0,0,0],
                [0,0,0,0]],
                [[0,0,5,0],
                [0,0,5,0],
                [0,0,5,0],
                [0,0,5,0]],
                [[0,0,0,0],
                [0,0,0,0],
                [5,5,5,5],
                [0,0,0,0]],
                [[0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0]]];
    }
    else if (n==6){
        return [[[0,6,6],
                [6,6,0],
                [0,0,0]],
                [[0,6,0],
                [0,6,6],
                [0,0,6]],
                [[0,0,0],
                [0,6,6],
                [6,6,0]],
                [[6,0,0],
                [6,6,0],
                [0,6,0]]];
    }
    else if (n==7){
        return [[[7,7,0],
                [0,7,7],
                [0,0,0]],
                [[0,0,7],
                [0,7,7],
                [0,7,0]],
                [[0,0,0],
                [7,7,0],
                [0,7,7]],
                [[0,7,0],
                [7,7,0],
                [7,0,0]]];
    }
}
const changeTetri=()=>{
    player.tetrimino=createTetri(Math.ceil(Math.random()*7));
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

let gameGrid=createGrid(10,20);

// initialize game
const render=()=>{
    // render black bg
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    renderTetri(gameGrid,{x:0,y:0});
    renderTetri(player.tetrimino[player.rotation],player.position);
    renderTetri(player.tetrimino[player.rotation],ghost.position);
}

const reset=()=>{
    if(gameGrid[0].some((n)=>n!=0)){
        gameGrid=createGrid(10,20);
        player.score=0;
    }
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

// render past tetrimino pieces?
const renderTetri=(tetri, offset)=>{
    tetri.forEach((row,yIndex)=>{
        row.forEach((value,xIndex)=>{
            if (value!=0){
            	// render tetrimino
                ctx.fillStyle=colors[value];
                ctx.fillRect(xIndex+offset.x,yIndex+offset.y,1,1);
            }
        })
    })
}

let counter=0;

const softDrop=()=>{
	player.position.y++;
    if(checkCollision(gameGrid,player)){
        player.position.y--;
        merge(gameGrid,player);
        clearRow();
        player.position={x:4,y:0};
        changeTetri();
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
}
const checkCollision=(gameGrid,player)=>{
    // check if the player tetrimino has touched the floor or the games senses another block direcly below
    // potential player position
    // get the location
    // check all values of current location on the gamegrid
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
    // if the grid row is full of non-zero numbers, remove the row array and add back an empty array at the top
    for(row in gameGrid){
        console.log(gameGrid[row].every((n)=>n!=0));
        if(gameGrid[row].every((n)=>n!=0)){
            gameGrid.splice(row,1);
            gameGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            console.log(gameGrid);
        }
    }
}
let hold1=null;
let hold2=null;
const hold=()=>{
    if (hold1==null){
        hold1=player.tetrimino;
        player.position={x:4,y:0};
        changeTetri();
    }
    else{
        hold2=player.tetrimino;
        player.tetrimino=hold1;
        hold1=hold2;
        player.position={x:4,y:0};
    }
}

const update=()=>{
		counter+=60;
		if(counter>1000){
			softDrop();
			counter=0;
		}
    updateGhost();
    render();
    reset();
    requestAnimationFrame(update);
}

// Key Switch
document.addEventListener('keydown', e => {
  const keyCode = e.keyCode;
  if ([16,32,37, 38, 39, 40,81,87].includes(keyCode)) {
    e.preventDefault();
  }
  switch (keyCode) {
    case 16:
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
    // right arrow
    case 39:
        moveDir(1);
        break;
    // down arrow
    case 40:
	    softDrop();
        break;
    // q
    case 81:
        rotate(-1);
        break;
    // w
    case 87:
        rotate(1);
        break;
  }
});
update();
updatePlayer2(0,0);
// console.table(gameGrid);