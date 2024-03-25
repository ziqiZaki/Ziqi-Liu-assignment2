import React, {useEffect, useRef} from "react";
import { useNavigate, Link } from 'react-router-dom';
import './FirstPage.css';

const FirstPage = () => {
    const navigate = useNavigate();
    const textRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const value = window.scrollY;
            if (textRef.current) {
                textRef.current.style.marginTop = `${value * 2.5}px`;
            }
        };

        window.addEventListener('scroll', handleScroll);

        // return () => {
        //     window.removeEventListener('scroll', handleScroll);
        // };
    }, []);

    const startGame = () => {
        navigate('/simu');
    };

    return (
        <div>
            <header>
                <nav className="navi">
                    <Link to="/" className="active">Home</Link>
                    <Link to="/simu">Game</Link>
                    <Link to="/Credits">Credits</Link>
                </nav>
            </header>

            <section class="parallax">
                <h2 id="text" ref={textRef}>Conway's Game of Life</h2>

                <div className="scroll-hint">
                Scroll down to know more about this game...
                </div>
            </section>

            <section className="sec">
                <h2>Origin</h2>
                <p>
                
                The Game of Life is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is Turing complete and can simulate a universal constructor or any other Turing machine.

                </p>
                <h2>Rules</h2>
                <p>
                The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead. Every cell interacts with its eight neighbors, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
                </p>
                <p>
                1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
                </p>
                <p>
                2. Any live cell with two or three live neighbors lives on to the next generation.
                </p>
                <p>
                3. Any live cell with more than three live neighbors dies, as if by overpopulation.
                </p>
                <p>
                4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
                </p>
                <p>
                The first generation is created by applying the above rules simultaneously to every cell in the seed, live or dead; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.
                </p>

                <p>
                <button onClick={startGame} className="start-game-btn">Start Game!</button>
                </p>
            </section>
        </div>
    )

}

export default FirstPage;