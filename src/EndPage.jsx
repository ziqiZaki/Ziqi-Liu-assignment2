import React, {useRef} from "react";
import { Link } from 'react-router-dom';
import './EndPage.css';

const EndPage = () => {

    const handlePortfolioClick = () => {
        window.open('https://pages.github.khoury.northeastern.edu/ziqiscarlett/ziqiscarlett.github.io/');
    };

    const handleGithubClick = () => {
        window.open('https://github.khoury.northeastern.edu/ziqiscarlett/Ziqi-Liu-assignment2.git');
    };

    return (
        <div>
            <header>
                <nav className="navi">
                    <Link to="/">Home</Link>
                    <Link to="/simu">Game</Link>
                    <Link to="/Credits" className="active">Credits</Link>
                </nav>
            </header>

            <section class="parallax">
                <section id="portfolio">
                    <div class="pic_container slide-in">
                        <img src={require("./ziqi.png")} alt="Ziqi picture" className="circular-image"/>
                    </div>
                    <div class="text">
                        <p class="text-p1">
                            Hello, I'm
                        </p>
                        <p class="text-p2">
                            Ziqi Liu
                        </p>
                        <p class="text-p3">
                            A Full Stack Engineer
                        </p>
                        <div class="btn-container">
                            <button
                            class="btn1" onClick={handlePortfolioClick}>
                                My Portfolio
                            </button>
                            <button
                            class="btn2" onClick={handleGithubClick}>
                                Github
                            </button>

                        </div>
                    </div>
                </section>
            </section>
        </div>
    );

};

export default EndPage;