/*
    HTML and Initialization
*/

// Fetch HTML elements to be modified
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const dpi = window.devicePixelRatio;
const btnRun = document.getElementById('btnRun');
const selAtk = document.getElementById('selAtk');
const selDec = document.getElementById('selDec');
const selSus = document.getElementById('selSus');
const selRel = document.getElementById('selRel');

// Perform a DPI fix for drawing
function DPIFix() {
    //create a style object that returns width and height  
    let style = {
        height() {
          return + getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
        },
        width() {
          return + getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
        }
    }//set the correct attributes for a crystal clear image!  
    canvas.setAttribute('width', style.width() * dpi);
    canvas.setAttribute('height', style.height() * dpi);
}

DPIFix();

/*
    Metavars
*/

// Grid Display
let grid; // Render grid
let gridBase; // Starting array for grid before game
let gridTog; // Which grid cells are toggled
let gridTogOld; // Storage for calculating new iteration
let cellsize = 50; // Size of cell squares
let cellspc = 5; // Space of cells
let gridwidth = Math.floor(canvas.width / (cellsize + cellspc)); // # of columns
let gridheight = Math.floor(canvas.height / (cellsize + cellspc));; // # of rows
let cellcolor = ['black', 'white']
// Game toggle
let gameOn = false;
// Music controls
let atk = 0
let dec = 0
let sus = 0.5
let rel = 0.2
let chord = [];

/* 
    Tone Code 
*/

// Set up a synth
const synth = new Tone.PolySynth().toDestination();
console.log(synth.get())

/*
    Header Code
*/

// Button to start/end the game
btnRun.onclick = function(){
    // Toggle game state
    if (!gameOn){
        // Save current grid layout
        // Turn game on
        btnRun.innerHTML = "Stop Game";
        gameOn = true;
    } else {
        // Turn game off
        gameOn = false;
        btnRun.innerHTML = "Start Game"
        // Reinitialize base game state
    }
}

// Update envelope values whenever changed
selAtk.addEventListener('input', function (e) {
    synth.set({
        envelope: {
            attack: e.target.value/10
        }
    });
});

selDec.addEventListener('input', function (e) {
    synth.set({
        envelope: {
            decay: e.target.value/10
        }
    });
});

selSus.addEventListener('input', function (e) {
    synth.set({
        envelope: {
            sustain: e.target.value/10
        }
    });
});

selRel.addEventListener('input', function (e) {
    synth.set({
        envelope: {
            // Make sure value is NEVER 0, makes clicky noise
            release: e.target.value/10 + 0.01
        }
    });
});

/*
    Canvas Code
*/

// Cell class
class Cell {
    constructor(x, y, drawx, drawy){
        this.x = x;
        this.y = y;
        this.drawx = drawx;
        this.drawy = drawy;
        this.color = cellcolor[0];
        this.note = Tone.Frequency(this.x + 40, "midi").toNote();
    }

    // Toggle the cell on/off
    toggle(){
        gridTog[this.x][this.y] = 1 - gridTog[this.x][this.y];
        this.color = cellcolor[gridTog[this.x][this.y]];
        // Play the associated sound
        synth.triggerAttackRelease(this.note, "8n");
    }

    // Draw the cell
    draw(){
        // Draw the rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.drawx, this.drawy, cellsize, cellsize);
    }

    // Play the note associated with the cell
    play(){
        synth.triggerAttackRelease(this.note, "8n");
    }

    // Check if the cell will be alive on the next iteration
    // NOTE: NO WRAPPING
    isAlive(){
        // Get cells to check
        let totl = 0;
        let xlow = Math.max(0, this.x-1);
        let xhigh = Math.min(gridwidth, this.x+2);
        let ylow = Math.max(0, this.y-1);
        let yhigh = Math.min(gridheight, this.y+2);
        // Check the grid values
        for (let x = xlow; x < xhigh; x++){
            for (let y = ylow; y < yhigh; y++){
                totl += gridTogOld[x][y]
            }
        }
        // See if it matches conditions to live
        if (gridTog[this.x][this.y] && (3 <= totl && totl <= 4)){
            gridTog[this.x][this.y] = 1
            this.color = cellcolor[1]
            //chord.push(this.note);
        } else if (!gridTog[this.x][this.y] && totl == 3){
            gridTog[this.x][this.y] = 1
            this.color = cellcolor[1]
            // Only push the note if its a new cell
            chord.push(this.note);
        } else {
            gridTog[this.x][this.y] = 0
            this.color = cellcolor[0]
        }
    }
}


// Initialize the grid
function gridInit(){
    // Fill the grid obj with rectangles
    grid = new Array(gridwidth)
    gridTog = new Array(gridwidth)
    for (let x = 0; x < gridwidth; x++){
        grid[x] = new Array(gridheight)
        gridTog[x] = new Array(gridheight)
        for (let y = 0; y < gridheight; y++){
            grid[x][y] = new Cell(x, y, (x*cellsize)+cellspc*(x+1), (y*cellsize)+cellspc*(y+1))
            gridTog[x][y] = 0
        }
    }
}

// Draw the grid
function gridDraw(){
    for (let x = 0; x < gridwidth; x++){
        for (let y = 0; y < gridheight; y++){
            grid[x][y].draw();
        }
    }
}

// Calculate next steps for the grid and draw
function gridIterDraw(){
    // Update the old stored gridTog and chord
    chord = []
    gridTogOld = gridTog.map(function(col) {
        return col.slice();
    });
    for (let x = 0; x < gridwidth; x++){
        for (let y = 0; y < gridheight; y++){
            grid[x][y].isAlive();
            grid[x][y].draw();
        }
    }
    // Play the chord
    synth.triggerAttackRelease(chord, "8n");
}

// Create a click event for the canvas
canvas.onmousedown = function(e){
    // See which rectangle is clicked
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;
    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;
    for (const col of grid){
        for (const cl of col){
            // Check for collision
            if (!gameOn && (x >= cl.drawx && y >= cl.drawy &&
                x <= cl.drawx + cellsize && y <= cl.drawy + cellsize)){
                    // Toggle and leave the function
                    cl.toggle()
                    return;
            }
        }
    }
}

// Get scroll to move in/out
canvas.onwheel = function(e){
    // Adjust view size
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Game loop to draw the grid and play music
async function gridLoop(){
    // DPI
    DPIFix();
    // Drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // If in game, run code iterations
    if (gameOn){
        gridIterDraw();
        await delay(500);
    } else {
        gridDraw();
    }
    window.requestAnimationFrame(gridLoop);
}

// Draw to screen
window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)} // simulate calling code 60 times/s

// Start draw loop
gridInit()
window.requestAnimationFrame(gridLoop);

