# Conway Synth
Synthesizer based on Conway's Game of Life
Trying to avoid step sequencer fashions that have been done before and basing it on actual cell generation

## Why JS?
I started in Python, brew and pip weren't being friendly to one another, and I really wanted to get this underway before the momentum slowed. Furthermore, I'm more familiar with `tone.js`, which seemed to be better documented and easier to use than Python's `pyo`

## To Run
To currently run this project:
- Navigate to the `server` folder, and run `npm update`
- Run `node server.js`
- Navigate to `localhost:3000` to access the frontend

To run the depricated  Python code:
- Don't, like please, I don't think it works and it's just around for some code guidance
- Run `main.py`
- Click any boxes for the initial condition
- Press `return` to start the game

TODO/Goals
- UI
    - Knobs/sliders to change sound
    - Key selector
    - Change box size for different resolutions?
    - ~~Adjust resolution for different screen sizes~~
- Backend
    - Change sound with y-axis (?)
    - Add tempo adjustment
    - Add in customizers for notes (envelope, portamento, etc.)
    - Return to starting grid when stopping game
    - ~~Only play notes of NEW boxes~~