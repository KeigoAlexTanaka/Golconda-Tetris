const canvas=document.querySelector('canvas');
const c = canvas.getContext('2d');
c.scale(20,20);

const player={
    pos: {x:0,y:0},
    matrix: null,
    score:0
}

// create game grid
const createMatrix=(w,h)=>{
    const matrix=[];
    while (h>0){
        matrix.push(new Array(w).fill(0));
        h--;
    }
    return matrix;
}

// grid
const arena=createMatrix(10,20);

// initialize game
const draw=()=>{
    // render black bg
    c.fillStyle="#000";
    c.fillRect(0,0,canvas.width,canvas.height);
    // create game grid
    drawMatrix(arena,{x:0,y:0});
    // first tetrimino
    drawMatrix(player.matrix,player.pos);
}

// render past tetrimino pieces?
const drawMatrix=(matrix, offset)=>{
    matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if (value!=0){
                c.fillStyle=colors[value];
                c.fillRect(x+offset.x,
                            y+offset.y,1,1);
            }
        })
    })
}

// create tetriminos
const createPiece=(type)=>{
    if (type=="T"){
        return [[0,0,0],
                [1,1,1],
                [0,1,0]];
    }
    else if (type=="O"){
        return [[2,2],
                [2,2]];
    }
    else if (type=="L"){
        return [[0,3,0],
                [0,3,0],
                [0,3,3]];
    }
    else if (type=="J"){
        return [[0,4,0],
                [0,4,0],
                [4,4,0]];
    }
    else if (type=="I"){
        return [[0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0]
                ];
    }
    else if (type=="S"){
        return [[0,6,6],
                [6,6,0],
                [0,0,0]];
    }
    else if (type=="Z"){
        return [[7,7,0],
                [0,7,7],
                [0,0,0]];
    }
}

// color palletes
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

// clear row
const arenaSweep=()=>{
    let rowCount=1;
    outer: for (let y=arena.length-1;y>0;y--){
        for(let x=0;x<arena[y].length;x++){
            if (arena[y][x]===0){
                continue outer;
            }
        }
        const row= arena.splice(y,1)[0].fill(0);
        arena.unshift(row);
        y++;
        player.score+=rowCount*10;
        rowCount*=2;
    }
}

// check for collision
const collide=(arena,player)=>{
    const [m,o]=[player.matrix,player.pos];
    // console.log(m.length);
    console.table(arena);
    for(let y=0;y<m.length;y++){
        for(let x=0;x<m[y].length;x++){
            if(m[y][x]!==0&&(arena[y+o.y]&&arena[y+o.y][x+o.x])!==0){
                return true;
            }
        }
    }
    return false;
}

// updates game board
const merge=(arena,player)=>{
    player.matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value!=0){
                arena[y+player.pos.y][x+player.pos.x]=value;
            }
        })
    })
}

// drop piece until it reaches a floor
const playerDrop=()=>{
    player.pos.y++;
    if(collide(arena,player)){
        player.pos.y--;
        merge(arena,player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter=0;
}

// move piece left/right
const playerMove=(dir)=>{
    player.pos.x+=dir;
    if(collide(arena,player)){
        player.pos.x-=dir;
    }
}

// update table rotation
const playerRotate=(dir)=>{
    const pos=player.pos.x;
    let offset=1;
    rotate(player.matrix,dir);
    while(collide(arena,player)){
        player.pos.x+=offset;
        offset=-(offset+(offset>0?1:-1));
        if (offset > player.matrix[0].length){
            rotate(player.matrix,-dir);
            player.pos.x=pos;
            return;
        }
    }
}

// rotate piece
const rotate=(matrix,dir)=>{
    for(let y=0;y<matrix.length;y++){
        for(let x=0;x<y;x++){
            // transpose [a,b]=[b,a]
            [matrix[x][y],
             matrix[y][x]]=
            [matrix[y][x],
             matrix[x][y]]
        }
    }
    // clockwise [a,b,c]=[c,b,a]
    if (dir>0){
        matrix.forEach(row=>row.reverse());
    }
    // counter-clockwise
    else {
        matrix.reverse();
    }
}

let dropCounter=0;
let dropInterval=1000;
// constantly lower tetrimino and check for floor collision
const update=()=>{
    dropCounter+=10;
    collide(arena,player);
    if (dropCounter>dropInterval){
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

// reset game on gameover
const playerReset=()=>{
    const pieces="ILJOTSZ";
    player.matrix=createPiece(pieces[pieces.length*Math.random()|0]);
    player.pos.y=0;
    player.pos.x=(arena[0].length/2-1);
    if(collide(arena,player)){
        arena.forEach(row=>row.fill(0));
        player.score=0;
        updateScore;
    }
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
        playerMove(-1);
        break;
    // right arrow
    case 39:
        playerMove(1);
        break;
    // down arrow
    case 40:
        playerDrop();
        break;
    // q
    case 81:
        playerRotate(-1);
        break;
    // w
    case 87:
        playerRotate(1);
        break;
  }
});

// score update
const updateScore=()=>{
    document.getElementById("score").innerHTML=player.score;
}

playerReset();
updateScore();
update();