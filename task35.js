// html init drawing
var elementsToDraw = [
    {
        ele: 'div',
        id: 'grid',
        txt: ''
    },
    {
        ele: 'button',
        id: 'fill',
        txt: 'Random Life'
    },
    {
        ele: 'button',
        id: 'perfectLayout',
        txt: 'You will like it'
    },
    {
        ele: 'button',
        id: 'next',
        txt: 'Next generation'
    },
    {
        ele: 'button',
        id: 'lazynext',
        txt: 'Lazy button for next generation spam'
    },
    {
        ele: 'button',
        id: 'stop',
        txt: 'Stop'
    }
];
elementsToDraw.forEach(function (item) {
    var element = document.createElement(item.ele);
    element.id = item.id;
    element.innerText = item.txt;
    document.body.appendChild(element);
});
var grid = document.getElementById('grid');
var buttonNext = document.getElementById('next');
var buttonLazyNext = document.getElementById('lazynext');
var buttonLife = document.getElementById('fill');
var buttonPerfectLayout = document.getElementById('perfectLayout');
var buttonStop = document.getElementById('stop');
// main array for initialize step
var gridArray;
// swapping array
var tempGridArray;
// optional array for feature 'perfect layout'
var perfectLayout;
var rowsCount;
var cellsInRow;
var perfectLayoutInterval;
var lazyInterval;
// initialization of grid layout
function generateGrid(rows, cells) {
    rowsCount = rows;
    cellsInRow = cells;
    var arrToReturn = Array.apply(null, Array(rows));
    for (var i = 0; i < arrToReturn.length; i += 1) {
        arrToReturn[i] = Array.apply(null, Array(cells));
        for (var x = 0; x < arrToReturn[i].length; x += 1) {
            arrToReturn[i][x] = 0;
        }
    }
    return arrToReturn;
}
// init empty field generation
gridArray = generateGrid(30, 30);
tempGridArray = generateGrid(rowsCount, cellsInRow);
// perfect grid layout
perfectLayout = generateGrid(rowsCount, cellsInRow);
for (var a = 0; a < rowsCount; a += 1) {
    for (var b = 0; b < cellsInRow; b += 1) {
        // perfect layout properties
        var perfectLayoutTemplateEnds = (a === 12 || a === 14)
        && (b > 10 && b < 19);
        var perfectTemplateMiddleExclude = b !== 12 && b !== 17;
        var perfectLayoutTemplateMiddle = (a === 13)
        && (b > 10 && b < 19 && perfectTemplateMiddleExclude);
        if ((perfectLayoutTemplateEnds) || (perfectLayoutTemplateMiddle)) {
            perfectLayout[a][b] = 1;
        }
    }
}
// randomize grid layout
function fillRandom() {
    for (var k = 0; k < rowsCount; k += 1) {
        for (var m = 0; m < cellsInRow; m += 1) {
            var luck = Math.round(Math.random());
            if (luck === 1) {
                gridArray[k][m] = 1;
            } else {
                gridArray[k][m] = 0;
            }
        }
    }
}
// drawing grid in matching with grid layout
function gridDraw(layout) {
    grid.innerHTML = '';
    layout.forEach(function (row, rowIndex) {
        var rowElement = document.createElement('div');
        rowElement.id = 'row-' + rowIndex;
        rowElement.className = 'row';
        row.forEach(function (cell, cellIndex) {
            var cellElement = document.createElement('input');
            cellElement.type = 'checkbox';
            cellElement.id = 'row-' + rowIndex + ' cell-' + cellIndex;
            cellElement.className = 'cell';
            cellElement.checked = cell;
            rowElement.appendChild(cellElement);
        });
        grid.appendChild(rowElement);
    });
}
// init draw, for non empty field
gridDraw(gridArray);
// custom cells by clicks
grid.addEventListener('click', function (e) {
    if (e.target.type === 'checkbox') {
        var status = e.target.checked;
        var paramOfClick = e.target.id.split(' ');
        var rowPos = paramOfClick[0].split('-')[1];
        var cellPos = paramOfClick[1].split('-')[1];
        gridArray[rowPos][cellPos] = Number(status);
    }
});
// next gen implementing
function nextGenArray() {
    // run every cell
    gridArray.forEach(function (row, rowIdx) {
        row.forEach(function (_, cellIdx) {
            var neighborCount = 0;
            // loops for checking neighbor
            for (var deltaX = -1; deltaX <= 1; deltaX += 1) {
                for (var deltaY = -1; deltaY <= 1; deltaY += 1) {
                    // not counting self when neighbors counting
                    var self = deltaX === 0 && deltaY === 0;
                    var xPosCheck = rowIdx + deltaX !== -1
                    && rowIdx + deltaX < gridArray.length;
                    var yPosCheck = cellIdx + deltaY !== -1
                    && cellIdx + deltaY < gridArray.length;
                    if (xPosCheck && yPosCheck && !self
                        && gridArray[rowIdx + deltaX][cellIdx + deltaY] === 1) {
                        neighborCount += 1;
                    }
                }
            }
            // aliving if dead
            if ((neighborCount === 3) && (gridArray[rowIdx][cellIdx] === 0)) {
                tempGridArray[rowIdx][cellIdx] = 1;
            }
            // just chilling if alive
            if ((neighborCount <= 3 && neighborCount >= 2)
            && (gridArray[rowIdx][cellIdx] === 1)) {
                tempGridArray[rowIdx][cellIdx] = 1;
            }
            // dying if alive
            if ((neighborCount > 3 || neighborCount < 2)
            && (gridArray[rowIdx][cellIdx] === 1)) {
                tempGridArray[rowIdx][cellIdx] = 0;
            }
        });
    });
}
// listener for random life
buttonLife.addEventListener('click', function () {
    fillRandom();
    gridDraw(gridArray);
});
// listener for perfect layout
buttonPerfectLayout.addEventListener('click', function () {
    gridDraw(perfectLayout);
    gridArray = perfectLayout;
    perfectLayoutInterval = setInterval(function () {
        nextGenArray();
        gridDraw(tempGridArray);
        gridArray = tempGridArray;
        // reseting temporary array, LE is fixed => calling new array
        tempGridArray = generateGrid(rowsCount, cellsInRow);
    }, 200);
});
// listener for manual next gen
buttonNext.addEventListener('click', function () {
    nextGenArray();
    gridDraw(tempGridArray);
    gridArray = tempGridArray;
    tempGridArray = generateGrid(rowsCount, cellsInRow);
});
// listener for lazy auto next gen
buttonLazyNext.addEventListener('click', function () {
    lazyInterval = setInterval(function () {
        nextGenArray();
        gridDraw(tempGridArray);
        gridArray = tempGridArray;
        tempGridArray = generateGrid(rowsCount, cellsInRow);
    }, 200);
});
// stop all generations
buttonStop.addEventListener('click', function () {
    clearInterval(lazyInterval);
    clearInterval(perfectLayoutInterval);
});
