import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { HandmanDrawing } from './HandmanDrawing';
import { HandmanWord } from './HandmanWord';
import { Keyboard } from './Keyboard';
import words from './wordList.json'

function App() {
  const getWord = () => {
    return words[Math.floor(Math.random() * words.length)]
  }
  const [wordToGuess, setWordToGuess] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const inCorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))

  const isLoser = inCorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every(letter =>
    guessedLetters.includes(letter))

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser
      || isWinner) return

    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters, isWinner, isLoser])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key !== "Enter") return
      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())
    }
    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (!key.match(/^[a-z]$/)) return
      e.preventDefault()
      addGuessedLetter(key);
    }
    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  return (
    <div style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: "0 auto",
      alignItems: "center"
    }}>
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isLoser && "You suck!!!!"}
        {isWinner && "You are AMAZING, have nice day!"}

      </div>
      <HandmanDrawing numberOfGuesses={inCorrectLetters.length} />
      <HandmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
          inactiveLetters={inCorrectLetters}
          addGuessedLetters={addGuessedLetter}
        />
      </div>
    </div>
  )
}

export default App
