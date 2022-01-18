import pygame
import sys
import time
import math

##
#   METAVARS
##

BLACK = (0, 0, 0)
WHITE = (200, 200, 200)
RED = (200, 0, 200)
# Colors for boxes when toggled
# [Off, On]
TOGGLE_COLOR = [(200, 200, 200), (200, 0, 200)]
WINDOW_HEIGHT = 400
WINDOW_WIDTH = 400
blockSize = 20 #Set the size of the grid block

##
# FUNCTIONS
##

# Misc Functions

# Check surrounding boxes with wrapping
def isAliveWrap(gridTog, xcell, ycell):
    totl = 0
    lg = len(gridTog)
    # Check three rows
    for x in range((xcell+1)%lg-2, (xcell+1)%lg+1):
        for y in range((ycell+1)%lg-2, (ycell+1)%lg+1):
            totl += gridTog[x][y]
    # Consider original
    if gridTog[xcell][ycell]:
        # Cell on (sub 1 from total)
        if 3 <= totl <= 4:
            return 1
        else:
            return 0
    else:
        # Cell off
        if totl == 3:
            return 1
        else:
            return 0

# Check surrounding boxes without wrapping
def isAliveNoWrap(gridTog, xcell, ycell):
    totl = 0
    lg = len(gridTog)
    xlow = math.floor(xcell-1, 0) 
    xhigh = math.ceil(xcell+2, len[gridTog])
    ylow = math.floor(ycell-1, 0)
    yhigh = math.ceil(ycell+2, len[gridTog])
    # Check three rows
    for x in range(xlow, xhigh):
        for y in range(ylow, yhigh):
            totl += gridTog[x][y]
    # Consider original
    if gridTog[xcell][ycell]:
        # Cell on (sub 1 from total)
        if 3 <= totl <= 4:
            return 1
        else:
            return 0
    else:
        # Cell off
        if totl == 3:
            return 1
        else:
            return 0


# Grid Functions

# Initialize the grids
def gridInit():
    # Initialize a list for the grid
    gridObj = []
    gridTog = []
    for x in range(0, WINDOW_WIDTH, blockSize):
        gridObj.append([])
        gridTog.append([])
        for y in range(0, WINDOW_HEIGHT, blockSize):
            rect = pygame.Rect(x, y, blockSize, blockSize)
            gridObj[x//blockSize].append(rect)
            gridTog[x//blockSize].append(0)
    return [gridObj, gridTog]

# Game update for the grid
def gridUpdate(gridTog):
    gridNew = []
    for x in range(0, len(gridTog)):
        gridNew.append([])
        for y in range(0, len(gridTog[0])):
            # Check surrounding cells
            gridNew[x].append(isAliveWrap(gridTog, x, y))
    # Return new gridTog
    return gridNew

# Draw the grid
def gridDraw(gridObj, gridTog):
    for x in range(0, len(gridObj)):
        for y in range(0, len(gridObj[0])):
            rect = gridObj[x][y]
            clr = TOGGLE_COLOR[gridTog[x][y]]
            pygame.draw.rect(SCREEN, clr, rect, 1)

##
# MAIN LOOP
##

def main():
    global SCREEN, CLOCK
    pygame.init()
    SCREEN = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
    CLOCK = pygame.time.Clock()
    SCREEN.fill(BLACK)

    [gridObj, gridTog] = gridInit()

    inGame = False
    
    # Prep
    while not inGame:
        for event in pygame.event.get():
            # Quit the game
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            # Click on grid
            elif event.type == pygame.MOUSEBUTTONDOWN:
                # Get mouse position
                pos = pygame.mouse.get_pos()
                # Get all sprites under it
                for x in range(0, len(gridObj)):
                    for y in range(0, len(gridObj[0])):
                        if gridObj[x][y].collidepoint(pos):
                            # Toggle 1/0 for the square
                            gridTog[x][y] = 1 - gridTog[x][y]
            # Keypress actions
            elif event.type == pygame.KEYDOWN:
                # Enter key, start GoL
                if event.key == pygame.K_RETURN:
                    print("Game start!")
                    inGame = True
        
        # Draw output
        gridDraw(gridObj, gridTog)
        pygame.display.update()
    
    # Game underway
    while inGame:
        # Perform Conway logic
        gridTog = gridUpdate(gridTog)

        # Draw output
        gridDraw(gridObj, gridTog)
        pygame.display.update()

        # Wait 1s
        #time.sleep(1)


main()

