import styles from './Game.module.css'
import {words} from "../../constants/words.js"
import {images} from "../../constants/images.js"
import {useState, useEffect} from "react";
import LetterCard from "../Letters/index.js";

function isWordPossible(word, letters) {
    const lettersArr = [...letters];
    for (let char of word) {
        const index = lettersArr.indexOf(char);
        if (index === -1) return false;
        lettersArr.splice(index, 1);
    }
    return true;
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function Game() {
    const [image, setImage] = useState(images[0])
    const [gameWord, setGameWord] = useState('');
    const [shuffledLetters, setShuffledLetters] = useState([]);
    const [usedLetters, setUsedLetters] = useState([]);
    const [possibleWords, setPossibleWords] = useState([]);
    const [usedIndexes, setUsedIndexes] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [status, setStatus] = useState('playing');

    useEffect(() => {
        startNewGame(true);
    }, []);

    const startNewGame = (newWord = true) => {
        const word = newWord
            ? words[Math.floor(Math.random() * words.length)].toUpperCase()
            : gameWord;

        const shuffled = shuffleArray(word.split(''));

        setGameWord(word);
        setShuffledLetters(shuffled);
        setUsedLetters([]);
        setUsedIndexes([]);
        setStatus('playing');
        setWrongGuesses(newWord ? 0 : wrongGuesses);

        const possible = words.filter(w =>
            isWordPossible(w.toUpperCase(), word.split(''))
        );
        setPossibleWords(possible.map(w => w.toUpperCase()));
    };

    const handleLetterClick = (letter, index) => {
        if (status !== 'playing' || usedIndexes.includes(index)) return;

        setUsedLetters([...usedLetters, letter]);
        setUsedIndexes([...usedIndexes, index]);

        if (usedLetters.length + 1 === gameWord.length) {
            const guess = [...usedLetters, letter].join('');
            if (guess === gameWord) {
                setStatus('win');
            } else {
                const newWrong = wrongGuesses + 1;
                if (newWrong >= 3) {
                    setStatus('lose');
                } else {
                    setWrongGuesses(newWrong);
                    setImage(images[newWrong]);
                    setUsedLetters([]);
                    setUsedIndexes([]);
                }
            }
        }
    };

    const renderHiddenWord = (word) => {
        const display = Array(word.length).fill('_');
        const used = [...usedLetters];
        for (let i = 0; i < used.length && i < word.length; i++) {
            display[i] = used[i];
        }
        return display.join(' ');
    };

    return (
        <div className={styles.App}>
            {status === 'playing' &&
                <>
                    <h1>Scrabble Word Finder</h1>

                    <img
                        alt={image}
                        src={image}
                    />

                    <ul className={styles.wordList}>
                        {possibleWords.map((word, index) => (
                            <li key={index}>{renderHiddenWord(word)}</li>
                        ))}
                    </ul>

                    <div className={styles.lettersContainer}>
                        {shuffledLetters.map((letter, index) => (
                            <LetterCard
                                key={index}
                                letter={letter}
                                onClick={() => handleLetterClick(letter, index)}
                                disabled={usedIndexes.includes(index)}
                            />
                        ))}
                    </div>
                </>
            }

            {status === 'win' &&
                <>
                    <h1 className={styles.win}>You Win!</h1>

                    <img
                        alt={image}
                        src={image}
                    />

                    <p>
                        The word was :
                        <b>
                            {possibleWords}
                        </b>
                    </p>

                    <button className={styles.restartButton} onClick={() => startNewGame(true)}>Restart Game</button>
                </>
            }

            {status === 'lose' &&
                <>
                    <h1 className={styles.lose}>You Lose</h1>

                    <img
                        alt={image}
                        src={image}
                    />

                    <p>
                        The word was indeed:
                        <b>
                            {possibleWords}
                        </b>
                    </p>

                    <button className={styles.restartButton} onClick={() => startNewGame(true)}>Restart Game</button>
                </>
            }
        </div>
    );
}

export default Game;