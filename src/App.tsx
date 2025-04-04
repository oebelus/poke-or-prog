import { useEffect, useRef, useState } from "react"
import "./index.css"
import { ProgrammingTerms } from "./resources/programming"
import { Pokemons } from "./resources/pokemons"
import { insults } from "./resources/constants"

function App() {
  const [gameOver, setGameOver] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [questionTuple, setQuestionTuple] = useState(["", ""])
  const [HP, setHP] = useState(3)

  const [pokemonColor, setPokemonColor] = useState("text-[#CFD58E]")
  const [programmingColor, setProgrammingColor] = useState("text-[#CFD58E]")
  
  const [position, setPosition] = useState({ x: 0, y: 0 }); 

  const [score, setScore] = useState(0)

  const pokemonRef = useRef<HTMLParagraphElement>(null);
  const programmingRef = useRef<HTMLParagraphElement>(null);
  const heartRef = useRef<HTMLImageElement>(null);

  const SPEED = 25;

  const getItem = (): string[] => {
    const randomProgrammingIndex = Math.floor(Math.random() * ProgrammingTerms.length)
    const randomPokemonIndex = Math.floor(Math.random() * Pokemons.length)

    const programmingTerm = ProgrammingTerms[randomProgrammingIndex]
    const pokemon = Pokemons[randomPokemonIndex]

    return Math.floor(Math.random() * 10) > 5 ? [programmingTerm, "programming"] : [pokemon, "pokemon"]
  }

  const verifyAnswer = (playerAnswer: string) => {
    if (questionTuple[1] == playerAnswer) {
      if (playerAnswer === "pokemon") {
        setQuestionTuple(["CORRECT!", "pokemon"])
        setPokemonColor("text-[#316535]")
        setScore(score + 1)
        setTimeout(() => {
          setQuestionTuple(getItem())
          setPokemonColor("text-[#CFD58E]")
        }, 2000);
      } else {
        setQuestionTuple(["CORRECT!", "programming"])
        setProgrammingColor("text-[#316535]")
        setScore(score + 1)
        setTimeout(() => {
          setQuestionTuple(getItem())
          setProgrammingColor("text-[#CFD58E]")
        }, 2000);
      }
    }
    else {
      if (playerAnswer == "pokemon") {
        setQuestionTuple(["WRONG! " + insults[Math.floor(Math.random() * insults.length)], "pokemon"])
        setPokemonColor("text-[#85252E]")
        setTimeout(() => {
          setQuestionTuple(getItem())
          setPokemonColor("text-[#CFD58E]")
          setHP(HP - 1)
        }, 2000);
      } else {
        setQuestionTuple(["WRONG! " + insults[Math.floor(Math.random() * insults.length)], "programming"])
        setProgrammingColor("text-[#85252E]")
        setTimeout(() => {
          setQuestionTuple(getItem())
          setProgrammingColor("text-[#CFD58E]")
          setHP(HP - 1)
        }, 2000);
      }
    }

    setPosition({ x: 0, y: 0 })
  }

  const handleStart = () => {
    setGameStarted(true)
    setQuestionTuple(getItem())
  }

  useEffect(() => {
    if (gameStarted && programmingRef && pokemonRef && heartRef) {
      const pokemonRect = pokemonRef.current?.getBoundingClientRect();
      const programmingRect = programmingRef.current?.getBoundingClientRect();

      const heartX = position.x + heartRef.current!.x
      const heartY = position.y + heartRef.current!.y

      if (pokemonRect && heartX < pokemonRect.x + pokemonRect.width && heartX > pokemonRect.x &&
          heartY < pokemonRect.y + pokemonRect.height && heartY > pokemonRect.y) {
            verifyAnswer("pokemon")
      }

      if (programmingRect && heartX <= programmingRect.x + programmingRect.width && heartX >= programmingRect.x &&
          heartY <= programmingRect.y + programmingRect.height && heartY >= programmingRect.y) {
            verifyAnswer("programming")
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, gameStarted, questionTuple]);


  useEffect(() => {
    if (HP === 0) {
      setGameOver(true)
    }
  }, [HP])

  const handleKeyDown = (e:KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        setPosition((prev) => ({ ...prev, x: prev.x - SPEED }));
        break;
      case 'ArrowRight':
        setPosition((prev) => ({ ...prev, x: prev.x + SPEED }));
        break;
      case 'ArrowUp':
        setPosition((prev) => ({ ...prev, y: prev.y - SPEED }));
        break;
      case 'ArrowDown':
        setPosition((prev) => ({ ...prev, y: prev.y + SPEED }));
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(max-width: 639px)').matches || window.matchMedia('(min-width: 640px) and (max-width: 1023px)').matches) {
      setGameOver(true)
    }
  }, [])

  const handleStartOver = () => {
    setGameStarted(false)
    setGameOver(false)
    setHP(3)
    setPokemonColor("text-[#CFD58E]")
    setProgrammingColor("text-[#CFD58E]")
    setPosition({ x: 0, y: 0 })
    setQuestionTuple(["", ""])
    setScore(0)
  }

  if (gameOver) 
    return (
      <div className="bg-black h-screen mx-auto"> 
        <p className="text-[10rem] text-center text-white leading-8 font-mono relative top-24">GAME</p>
        <p className="text-[10rem] text-center text-white font-mono relative top-20">OVER</p>
        <img className="mx-auto md:mt-12 md:w-1/4" src="broken-heart.png" alt="broken heart" />
        <p className="md:mt-1 -mt-12 text-white font-mono text-center text-xl md:text-3xl">Don't lose hope!</p>
        <p className="mt-2 text-white font-mono text-center text-xl md:text-3xl">And stay filled with determination...</p>
        <div
          onClick={handleStartOver} 
          className="lg:mt-12 mt-8 mx-auto mt-2 font-mono text-center text-xl md:text-3xl border-2 sm:border-4 border-yellow-300 text-yellow-300 p-1 p-4 w-1/2 md:w-1/4 hover:border-[#cc5b1c] hover:text-[#cc5b1c] transition-all cursor-pointer">
            TRY AGAIN
        </div>
        <p className="relative lg:top-20 top-8 text-white font-mono text-center text-xl md:text-3xl">{"("}{insults[Math.floor(Math.random() * insults.length)]}{")"}</p>

      </div>
    )
  else
    return (
      <div className="bg-black">
        <h1 className="mx-auto relative md:top-12 top-8 text-3xl sm:text-5xl text-center text-white font-mono"><i>POKEMON OR PROGRAMMING TERM?</i></h1>
        <div className="h-screen lg:w-1/2 mx-auto flex flex-col justify-center gap-1 sm:gap-4">
          <div className="-mt-6 lg:mt-6 flex mx-4 mb-4">
            <img className="mx-auto w-2/4 sm:w-1/4 sm:w-72" src="mettaton.png" alt="mettaton" />
            <div className="flex mx-auto h-1/2 w-1/2">
              <div className={`pixel-corners bg-white text-black bubble grow left ${ !gameStarted ? "h-fit" : ""}`}>
                {
                  !gameStarted ?
                  <p className="p-4 text-gray-800 sm:text-2xl font-mono font-bold">
                    * OH BOY!
                    <br/>
                    * I CAN ALREADY TELL IT'S GONNA <br></br>BE A GREAT SHOW!
                  </p>
                  :
                  <p className={`${questionTuple[0].split(" ").length < 2 ? "ml-8 " : ""} mt-8 font-bold font-mono text-black absolute p-2 text-center text-3xl`}>{questionTuple[0]}</p>
                }
              </div>
            </div>
          </div>

          {/* QUIZ ANSWERS */}
          <div className="font-mono sm:border-6 border-4 border-white p-4 h-1/4 mx-12 flex flex-col sm:flex-row justify-between md:gap-1 gap-4 items-center gap-4 sm:gap-6">
                <p ref={pokemonRef} id="pokemon" className={`${pokemonColor} ${gameStarted ? "flex" : "hidden"} md:text-4xl text-2xl mt-2 md:mb-2 md:ml-8`}>pokemon</p>
                <p ref={programmingRef} id="programming" className={`${programmingColor} ${gameStarted ? "flex" : "hidden"} md:text-4xl text-2xl mb-2 md:mt-2 md:mr-8`}>programming</p>
                <img 
                  src="red-heart.png"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                  }}
                  ref={heartRef}
                  className="w-10 absolute left-1/2 transform -translate-x-1/2" alt="heart" />
          </div>

          {/* HP */}
          <div className="flex justify-end mx-15">
            {
              3 - HP > 0 && Array(3-HP).fill(0).map((_, index) => (
                <div className="w-10" key={index}>
                  <img className="opacity-40" src="red-heart.png" alt="heart" />
                </div>
              ))
            }
            {
              HP > 0 && Array(HP).fill(0).map((_, index) => (
                <div className="w-10" key={index}>
                  <img src="red-heart.png" alt="heart" />
                </div>
              ))
            }
          </div>

          <div className="text-center grid grid-cols-2 sm:flex justify-between gap-4 sm:gap-6 p-4 mx-8 text-3xl md:text-5xl items-center font-mono font-bold">
            <div
              className="border-2 sm:border-4 border-[#E78650] text-[#E78650] p-1 sm:p-4 md:w-1/4 hover:border-[#cc5b1c] hover:text-[#cc5b1c] transition-all cursor-pointer"
              onClick={gameStarted ? () => setGameOver(true) : handleStart}
            >{gameStarted ? "END" : "START"}</div>
            <div className="border-2 sm:border-4 border-[#E78650] text-[#E78650] p-1 sm:p-4 md:w-1/4 hover:border-[#cc5b1c] hover:text-[#cc5b1c] transition-all cursor-pointer">ACT</div>
            <div className="border-2 sm:border-4 border-[#E78650] text-[#E78650] p-1 sm:p-4 md:w-1/4 hover:border-[#cc5b1c] hover:text-[#cc5b1c] transition-all cursor-pointer">ITEM</div>
            <div className="border-2 sm:border-4 border-[#E78650] text-[#E78650] p-1 sm:p-4 md:w-1/4 hover:border-[#cc5b1c] hover:text-[#cc5b1c] transition-all cursor-pointer">MERCY</div>
          </div>
        </div>
      </div>
    )
}

export default App
