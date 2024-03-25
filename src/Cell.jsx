import chroma from 'chroma-js';
import React, { useContext } from 'react';
import { GameContext } from './GameContext';

export default function Cell(props) {
    const { row, col } = props;

    const { handleClickCell, getAliveCellIndex, deathIterations, isHeatMapMode  } = useContext(GameContext);


    const deathIteration = deathIterations[`${row},${col}`] || 0;

    const isDeadStatus = getAliveCellIndex([row, col]) === -1

    // console.log(deathIteration);

    const colorScale = chroma.scale([
        'rgb(0, 0, 0)',
        'rgb(24, 53, 103)',
        'rgb(46, 100, 158)',
        'rgb(23, 173, 203)',
        'rgb(0, 250, 250)',
        ]).domain([0, 6, 7.5, 9, 10]);

    const getBackgroundColor = () => {
        // console.log(deathIteration);
        // console.log(colorScale(deathIteration).hex());
        // console.log(isDeadStatus);
        // if (isDeadStatus) {
        //     return colorScale(deathIteration).hex();
        // }
        
        if (isHeatMapMode) {
            if (isDeadStatus) {
                return colorScale(deathIteration).hex();
            } else {
                return 'white';
            }
        } else {
            return isDeadStatus ? 'black' : 'white';
        }
    };


    return (
        <div style={{ 
            width: 15,
            height: 15,
            border: "1px solid black",
            backgroundColor: getBackgroundColor()
        }}
        onClick={handleClickCell([row, col])}
        >

        </div>
    );
}