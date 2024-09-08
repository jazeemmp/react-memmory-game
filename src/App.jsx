import { useEffect, useMemo, useRef } from "react";
import "./App.css";
import { useState } from "react";
import Confetti from "react-confetti";

const gameIcons = ["🌟", "🍔", "🚐", "🎆", "⚓", "🛟", "🧊", "🍈", "🍇"];

function App() {
  const [pices, setPices] = useState([]);
  const [flipCount, setFlipCount] = useState(40);
  let timeout = useRef();
  const isGameComplete = useMemo(() => {
    if (pices.length > 0 && pices.every((pice) => pice.solved)) {
      return true;
    }
    return false;
  }, [pices]);

  const startGame = () => {
    const duplicateIcons = [...gameIcons, ...gameIcons];
    const newGameIcons = [];

    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateIcons.length);
      newGameIcons.push({
        emoji: duplicateIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });
      duplicateIcons.splice(randomIndex, 1);
    }
    setPices(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleActive = (data) => {
    if(flipCount < 0) return;
    setFlipCount(flipCount - 1);
    const flipedData = pices.filter((pice) => pice.flipped && !pice.solved);
    if (flipedData.length === 2) return;
    const newPices = pices.map((pice) => {
      if (pice.position === data.position) {
        pice.flipped = true;
      }
      return pice;
    });
    setPices(newPices);
  };

  const gameLogicForFlipped = () => {
    const flippedData = pices.filter((data) => data.flipped && !data.solved);

    if (flippedData.length === 2) {
      timeout.current = setTimeout(() => {
        setPices(
          pices.map((pice) => {
            if (
              pice.position === flippedData[0].position ||
              pice.position === flippedData[1].position
            ) {
              if (flippedData[0].emoji === flippedData[1].emoji) {
                pice.solved = true;
              } else {
                pice.flipped = false;
              }
            }
            return pice;
          })
        );
      }, 800);
    }
  };

  useEffect(() => {
    gameLogicForFlipped();
    return () => {
      clearTimeout(timeout.current);
    };
  }, [pices]);

  return (
    <main>
      <h1 className="title">Memmory Game </h1>
      <p className="count">
        Flips Left :{" "}
        <span className={`${flipCount < 5 ? "danger" : ""}`}>{flipCount}</span>
      </p>
      <div className="container">
        {pices.map((piece, index) => (
          <div
            className={`flip-card ${piece.flipped ? "active" : ""}`}
            key={index}
            onClick={() => handleActive(piece)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front"></div>
              <div className="flip-card-back">{piece.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {isGameComplete && (
        <div className="game-complete">
          <h1>YOU WON !!</h1>
          <button
            className="restart-btn"
            onClick={() => window.location.reload()}
          >
            Restart
          </button>
          <Confetti width={window.innerWidth} height={window.innerWidth} />{" "}
        </div>
      )}
      {flipCount < 1 && (
        <div className="game-over">
          <h1>Game Over</h1>
          <button
            className="restart-btn"
            onClick={() => window.location.reload()}
          >
            Restart
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
