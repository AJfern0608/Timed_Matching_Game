import React, { useState, useEffect } from 'react';
import './MatchingGame.css';

// Define card types
interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Define level configurations
interface Level {
  cards: number;
  timeLimit: number;
  name: string;
}

const levels: Level[] = [
  { cards: 8, timeLimit: 30, name: "Easy" },
  { cards: 12, timeLimit: 45, name: "Medium" },
  { cards: 16, timeLimit: 60, name: "Hard" },
  { cards: 20, timeLimit: 75, name: "Expert" },
  { cards: 24, timeLimit: 90, name: "Master" }
];

// Define game states
type GameState = "menu" | "instructions" | "playing" | "levelComplete" | "gameOver" | "gameComplete";

const MatchingGame: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>("menu");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('matchingGameHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [lives, setLives] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(levels[0].timeLimit);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Create card deck for current level
  const createDeck = (level: number) => {
    const symbols = ['🍎', '🍌', '🍓', '🍒', '🍑', '🍊', '🥝', '🍉', '🍇', '🍍', '🥭', '🍋', '🍏', '🍐', '🥥', '🥝', '🥑', '🍆', '🥔', '🥕'];
    const numberOfPairs = levels[level].cards / 2;
    const levelSymbols = symbols.slice(0, numberOfPairs);
    
    let newCards: Card[] = [];
    
    // Create pairs of cards
    levelSymbols.forEach((symbol, index) => {
      newCards.push({
        id: index * 2,
        value: symbol,
        isFlipped: false,
        isMatched: false
      });
      
      newCards.push({
        id: index * 2 + 1,
        value: symbol,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Shuffle cards
    return newCards.sort(() => Math.random() - 0.5);
  };

  // Initialize or reset game
  const initializeGame = () => {
    setGameState("menu");
    setCurrentLevel(0);
    setScore(0);
    setLives(3);
    loadHighScore();
  };

  // Start game
  const startGame = () => {
    setGameState("playing");
    setCurrentLevel(0);
    setScore(0);
    setLives(3);
    setTimeRemaining(levels[0].timeLimit);
    setCards(createDeck(0));
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
  };

  // Show instructions
  const showInstructions = () => {
    setGameState("instructions");
  };

  // Return to menu
  const returnToMenu = () => {
    setGameState("menu");
  };

  // Next level
  const nextLevel = () => {
    const nextLevelIndex = currentLevel + 1;
    
    if (nextLevelIndex < levels.length) {
      setCurrentLevel(nextLevelIndex);
      setTimeRemaining(levels[nextLevelIndex].timeLimit);
      setCards(createDeck(nextLevelIndex));
      setFlippedCards([]);
      setMatchedPairs(0);
      setMoves(0);
      setGameState("playing");
    } else {
      // Player has completed all levels
      completeGame();
    }
  };

  // Handle game completion
  const completeGame = () => {
    setGameState("gameComplete");
    
    // Check for high score
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('matchingGameHighScore', score.toString());
    }
  };

  // Handle game over
  const gameOver = () => {
    setGameState("gameOver");
    
    // Check for high score
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('matchingGameHighScore', score.toString());
    }
  };

  // Load high score from local storage
  const loadHighScore = () => {
    const savedHighScore = localStorage.getItem('matchingGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Don't allow clicks while processing a match or if card is already flipped
    if (isProcessing || flippedCards.length >= 2 || cards.find(card => card.id === id)?.isFlipped || cards.find(card => card.id === id)?.isMatched) {
      return;
    }
    
    // Flip the card
    setCards(cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));
    
    // Add card to flipped cards
    setFlippedCards([...flippedCards, id]);
  };

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      setMoves(moves + 1);
      
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      if (firstCard?.value === secondCard?.value) {
        // Match found
        setCards(cards.map(card => 
          card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card
        ));
        setMatchedPairs(matchedPairs + 1);
        setScore(score + 100);
        
        // Clear flipped cards
        setTimeout(() => {
          setFlippedCards([]);
          setIsProcessing(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  }, [flippedCards]);

  // Check win condition
  useEffect(() => {
    if (gameState === "playing" && matchedPairs === levels[currentLevel].cards / 2) {
      // Level complete
      const timeBonus = Math.floor(timeRemaining * 10);
      setScore(score + timeBonus);
      setGameState("levelComplete");
    }
  }, [matchedPairs, gameState]);

  // Timer
  useEffect(() => {
    let timer: number | null = null;
    
    if (gameState === "playing") {
      timer = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up
            clearInterval(timer as number);
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                gameOver();
              } else {
                // Reset level
                setCards(createDeck(currentLevel));
                setFlippedCards([]);
                setMatchedPairs(0);
                setMoves(0);
                setTimeRemaining(levels[currentLevel].timeLimit);
              }
              return newLives;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, currentLevel]);

  // Load high score on mount
  useEffect(() => {
    loadHighScore();
  }, []);
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render game based on current state
  return (
    <div className="matching-game">
      {/* Menu Screen */}
      {gameState === "menu" && (
        <div className="menu-screen">
          <h1>Memory Match</h1>
          <div className="menu-card">
            <h2>Test Your Memory!</h2>
            <p>Match pairs of cards before time runs out.</p>
            
            {highScore > 0 && (
              <div className="high-score">
                <p>High Score: {highScore}</p>
              </div>
            )}
            
            <div className="menu-buttons">
              <button onClick={startGame}>Start Game</button>
              <button onClick={showInstructions}>How to Play</button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Screen */}
      {gameState === "instructions" && (
        <div className="instructions-screen">
          <div className="instruction-card">
            <h2>How to Play</h2>
            
            <div className="instructions">
              <h3>Goal</h3>
              <p>Match all pairs of cards before the timer runs out.</p>
              
              <h3>Game Rules</h3>
              <ul>
                <li>Click a card to flip it over</li>
                <li>Try to find its matching pair</li>
                <li>If you match all cards, you advance to the next level</li>
                <li>If you run out of time, you lose a life</li>
                <li>The game ends when you complete all levels or lose all lives</li>
              </ul>
              
              <h3>Scoring</h3>
              <ul>
                <li>100 points for each matched pair</li>
                <li>Time bonus at the end of each level</li>
                <li>Try to achieve the highest score!</li>
              </ul>
            </div>
            
            <button onClick={returnToMenu}>Back to Menu</button>
          </div>
        </div>
      )}

      {/* Game Screen */}
      {gameState === "playing" && (
        <div className="game-screen">
          <div className="game-header">
            <div className="game-info">
              <p>Level: {currentLevel + 1} ({levels[currentLevel].name})</p>
              <p>Score: {score}</p>
              <p>Time: {formatTime(timeRemaining)}</p>
              <p>Lives: {Array(lives).fill('❤️').join('')}</p>
            </div>
          </div>
          
          <div className={`card-grid grid-${levels[currentLevel].cards}`}>
            {cards.map(card => (
              <div 
                key={card.id}
                className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="card-back">?</div>
                <div className="card-front">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Level Complete Screen */}
      {gameState === "levelComplete" && (
        <div className="level-complete-screen">
          <div className="complete-card">
            <h2>Level {currentLevel + 1} Complete!</h2>
            <p>Great job! You've matched all the cards.</p>
            
            <div className="score-info">
              <p>Level Score: {score}</p>
              <p>Time Bonus: +{Math.floor(timeRemaining * 10)}</p>
            </div>
            
            <button onClick={nextLevel}>Continue to Level {currentLevel + 2}</button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === "gameOver" && (
        <div className="game-over-screen">
          <div className="complete-card">
            <h2>Game Over</h2>
            <p>You've run out of lives!</p>
            
            <div className="score-info">
              <p>Final Score: {score}</p>
              <p>Level Reached: {currentLevel + 1}</p>
              {score > highScore && <p className="new-high-score">New High Score!</p>}
            </div>
            
            <div className="menu-buttons">
              <button onClick={startGame}>Play Again</button>
              <button onClick={returnToMenu}>Return to Menu</button>
            </div>
          </div>
        </div>
      )}

      {/* Game Complete Screen */}
      {gameState === "gameComplete" && (
        <div className="game-complete-screen">
          <div className="complete-card">
            <h2>Game Complete!</h2>
            <p>Congratulations! You've completed all levels!</p>
            
            <div className="score-info">
              <p>Final Score: {score}</p>
              {score > highScore && <p className="new-high-score">New High Score!</p>}
            </div>
            
            <div className="menu-buttons">
              <button onClick={startGame}>Play Again</button>
              <button onClick={returnToMenu}>Return to Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingGame;