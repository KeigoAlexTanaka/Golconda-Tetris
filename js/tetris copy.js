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

const gameGrid=createGrid(10,20);

// initialize game
const render=()=>{
    // render black bg
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    renderTetri(gameGrid,{x:0,y:0});
    renderTetri(player.tetrimino[player.rotation],player.position);
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
// let row=[0,0,0,0,0,0,0,0,0,0]
const clearRow=()=>{
    // if the grid row is full of non-zero numbers, pop the row array and add back an empty array at the top
    // console.table(gameGrid());
    for(row in gameGrid){
        console.log(gameGrid[row].every((n)=>n!=0));
        if(gameGrid[row].every((n)=>n!=0)){
            gameGrid.pop();
            gameGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            console.log(gameGrid);
        }
    }
}

const update=()=>{
		counter+=60;
		if(counter>1000){
			softDrop();
			counter=0;
		}
    render();
    requestAnimationFrame(update);
}

// Key Switch
document.addEventListener('keydown', e => {
  const keyCode = e.keyCode;
  if ([32,37, 38, 39, 40,81,87].includes(keyCode)) {
    e.preventDefault();
  }
  switch (keyCode) {
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