import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from 'react-router-dom';
import Cell from "./Cell";
import { SPEED, CHANCE_OF_LIVE } from "./constants";
import './board.css';
import { GameContext } from "./GameContext";

export default function Board(props) {
    const [ aliveCellsList, setAliveCellList ] = useState([]);
    const [ isRunning, setIsRunning ] = useState(false);
    const [row, setRow] = useState(20);
    const [col, setCol] = useState(20);
    const [ errorMessage, setErrormsg ] = useState("");
    const intervalRef = useRef(null);
    const [ roundCount, setRoundCount ] = useState(0);
    const [ isHeatMapMode, setIsHeatMapMode] = useState(false);
    // const { isHeatMapMode, setIsHeatMapMode } = useContext(GameContext);

    const initialDeathIterations = {};
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const key = `${i},${j}`;
            initialDeathIterations[key] = 0;
        }
    }

    const [ deathIterations, setDeathIterations] = useState(initialDeathIterations);

    useEffect(() => {
        handleReset();
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                handleNextRound();
            }, SPEED);
        }
        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
     }, [isRunning, aliveCellsList]);

    const handleStart = () => {
        setIsRunning(!isRunning);
    }

    const handleReset = () => {
        // extra credit part
        const newAliveCells = [];
        const newDeathIterations = {};

        const numOrigin = Math.floor((row * col) * 0.01);
        const seeds = [];

        for (let i = 0; i < numOrigin; i++) {
            const originRow = Math.floor(Math.random() * row);
            const originCol = Math.floor(Math.random() * col);
            seeds.push([originRow, originCol]);
        }

        const probabilityGrid = [];
        for (let i = 0; i < row; i++) {
            probabilityGrid.push(new Array(col).fill(0));
        }

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                for (const [originRow, originCol] of seeds) {
                    const distance = Math.sqrt((i - originRow) ** 2 + (j - originCol) ** 2);
                    const probability = Math.exp(-distance / 2);
                    probabilityGrid[i][j] += probability;
                }
            }
        }

        const neededAliveCells = Math.floor((row * col) * 0.1);
        let aliveCellsCount = 0;
        while (aliveCellsCount < neededAliveCells) {
            for (let i = 0; i < row; i++) {
                for (let j = 0; j < col; j++) {
                    const key = `${i},${j}`;
                    if (Math.random() < probabilityGrid[i][j] && aliveCellsCount < neededAliveCells) {
                        newAliveCells.push([i, j]);
                        aliveCellsCount++;
                        newDeathIterations[key] = 0;
                    } else {
                        newDeathIterations[key] = 1;
                    }
                }
            }
        }

        setAliveCellList(newAliveCells);
        setIsRunning(false);
        setRoundCount(0);
        setDeathIterations(newDeathIterations);
    };

    const handleSwitchHeatmap = () => {
        console.log(deathIterations);
        setIsHeatMapMode(!isHeatMapMode);
    };



    const handleNextRound = (e) => {
        // e.preventDefault();
        const nextRoundAliveCells = [];
        const newDeathIterations = {};

        let neighborCountMatrix = [];
        for (let i = 0; i < row; i++) {
            neighborCountMatrix.push(new Array(col).fill(0));
        }

        // update start
        aliveCellsList.forEach(cell => {
            const [x, y] = cell;
            const directions = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
            directions.forEach(([dx, dy]) => {
                const newX = x + dx, newY = y + dy;
                if (newX >= 0 && newX < row && newY >= 0 && newY < col) {
                    neighborCountMatrix[newX][newY]++;
                }
            });
        });

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                const alive = aliveCellsList.some(([x, y]) => x === i && y === j);
                const neighbors = neighborCountMatrix[i][j];
                if (alive && (neighbors === 2 || neighbors === 3)) {
                    nextRoundAliveCells.push([i, j]);
                } else if (!alive && neighbors === 3) {
                    nextRoundAliveCells.push([i, j]);
                }

                if (!alive) {
                    const key = `${i},${j}`;
                    newDeathIterations[key] = deathIterations[key] ? deathIterations[key] + 1 : 1;
                }
            }
        }

        setAliveCellList(nextRoundAliveCells);
        setRoundCount(prevCount => prevCount + 1);
        setDeathIterations(newDeathIterations);
    }

    const handleClickCell = (cell) => () => {

        const row = cell[0];
        const col = cell[1];
        const indexToRemove = getAliveCellIndex(cell);
        if (indexToRemove === -1) {
            setAliveCellList([...aliveCellsList, cell]);
            setDeathIterations({
                ...deathIterations,
                [`${row},${col}`]: deathIterations[`${row},${col}`] + 1
            })
        } else {
            setAliveCellList(aliveCellsList.filter((_, index) => index !== indexToRemove));
            setDeathIterations({
                ...deathIterations,
                [`${row},${col}`]: deathIterations[`${row},${col}`] - 1
            })
        }
    }

    const determineNextRonud = (neighborCountMatrix, cell) => {
        const directions = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, -1], [-1, 0], [-1, -1]];
        directions.forEach(direction => {
            const newPosition = [direction[0] + cell[0], direction[1] + cell[1]];
            if (isValid(newPosition)) {
                neighborCountMatrix[newPosition[0]][newPosition[1]]++;
            }
        });
    }

    const isValid = (position) => {
        return position[0] >= 0 && position[0] < row && position[1] >= 0 && position[1] < col;
    }

    const getAliveCellIndex = (position) => {
        return aliveCellsList.findIndex(cell => cell[0] === position[0] && cell[1] === position[1]);
    };

    const generateBoard = () => {
        let grid = [];

        for (let i = 0; i < row; i++) {
            let rowContent = [];
            for(let j = 0; j < col; j++) {
                rowContent.push(<Cell
                    row={i}
                    col={j}
                />);
            }
            grid.push(rowContent);
        }

        return grid;
    }

    const handleUserInput = (e) => {
        e.preventDefault();
        const userRow = parseInt(e.target.row.value);
        const userCol = parseInt(e.target.col.value);

        if (userRow < 3 || userRow > 40 || userCol < 3 || userCol > 40) {
            setErrormsg("Please enter a number between 3 and 40");
            return;
        }

        const newDeathIterations = {};
        for (let i = 0; i < userRow; i++) {
            for (let j = 0; j < userCol; j++) {
                const key = `${i},${j}`;
                newDeathIterations[key] = 0;
            }
        }

        setRow(userRow);
        console.log(row);

        setCol(userCol);
        setAliveCellList([]);
        setErrormsg("");
        setDeathIterations(newDeathIterations);
    }

    const context = {
        handleClickCell,
        getAliveCellIndex,
        deathIterations,
        isHeatMapMode
    }
    
    return (
        <GameContext.Provider value={context}>
            <div>
                <header>
                    <nav className="navi">
                        <Link to="/" >Home</Link>
                        <Link to="/simu" className="active">Game</Link>
                        <Link to="/Credits">Credits</Link>
                    </nav>
                </header>

                <div className="board-container">
                    <form onSubmit={handleUserInput}>
                        <input type="number" name="row" placeholder="Height">
                        </input>
                        <input type="number" name="col" placeholder="Width">
                        </input>
                        <button type="submit">Set</button>
                    </form>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="board-wrapper">
                        <div className="board" style={{
                            gridTemplateColumns: `repeat(${col}, 1fr)`
                        }}>
                            {generateBoard()}
                        </div>

                        <div className="counter">
                            <div className="cell-counter">
                                <p>
                                    Living Cells: {aliveCellsList.length}
                                </p>

                                <p>
                                    Round Count: {roundCount}
                                </p>
                            </div>

                            <div className="buttons">
                                <button className="button" onClick={handleNextRound}>NEXT ROUND</button>
                                <button className="button" onClick={handleStart}>{isRunning ? 'STOP' : 'START'}</button>
                                <button className="button" onClick={handleReset}>RESET</button>
                                <button className="button" onClick={handleSwitchHeatmap}>{isHeatMapMode ? 'Switch to Normal Mode' : 'Switch to Heat Map Mode'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GameContext.Provider>

    );
}