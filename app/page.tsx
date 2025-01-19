"use client"

import Image from "next/image";
import { translate } from "google-translate-api-browser"
import { SetStateAction, useEffect, useState, useRef } from "react";

import "bootstrap-icons/font/bootstrap-icons.css";

import { generate, count } from "random-words";
import Head from "next/head";

// sweet alert
import Swal from 'sweetalert2';


export default function Home() {
  const ipServer = "http://100.127.215.3"

  const [choiceCounting, setCounting] = useState(0);
  const [currentQueue, setQueue] = useState(Math.floor(Math.random() * 4));

  const [randomState, setRandomState] = useState(false);
  const [initRandomState, setInitState] = useState(true);
  const [loading, setLoading] = useState(false);

  const [word, setWord] = useState("Welcome to Singolingo")
  const [answer, setAnswer] = useState<string>("")
  const [choice, setChoice] = useState<string[]>([])

  const [answerKey, setAnswerKey] = useState<number>(-1);
  const [answerVal, setAnswerVal] = useState<string>("");

  const [score, setScore] = useState(0);
  const [mistake, setMistake] = useState(0);

  const [startState, setStartState] = useState(false);

  const [error, setError] = useState(false);

  const [hardLevel, setHardLevel] = useState(3);

  const bestScore = useRef(0);

  const vocabRandom = async () => {

    let randWord: any = generate({wordsPerString: 2})

    setWord(randWord)

    await translate(randWord, { to: "th", corsUrl: ipServer + ":8080/" })
      .then((res: { text: SetStateAction<string>; }) => {
        //console.log(res.text)
        setAnswer(res.text)
        // console.info("Answer OK")
      }).catch((err: any) => {
        console.error(err);
        setError(true);
      })
  }

  const choiceMake = async () => {
    let randWord: any = generate(3)
    // let currentList: string[] = [];

    for (let i = 0; i < 3; i++) {
      await translate(randWord[i], { to: "th", corsUrl: ipServer + ":8080/" })
        .then((res: { text: SetStateAction<string>; }) => {


          setChoice((prevItem: any) => {
            // currentList.push(res.text.toString())

            if (prevItem.length === 0) {
              return [res.text]
            } else {
              return [...prevItem, res.text]
            }

          })


          //setSpy([...spy, res.text])
          console.log(res.text);

        }).catch((err: any) => {
          console.error(err);
          setError(true);
        })
    }

    // console.log("result")
    // console.log( currentList)


  }

  // Answering
  const answerQuestion = (wordNow: string) => {
    if (answerKey === -1) {
      Swal.fire({
        title: 'Please select your answer',
        text: 'กรุณาเลือกคำตอบก่อน',
        icon: 'warning',
        confirmButtonText: 'Okay'
      })
      // alert("Please select your answer");
      return;
    }

    setAnswerVal("");
    setAnswerKey(-1);
    if (wordNow === answer) {
      Swal.fire({
        title: 'You\'re the best!',
        text: 'ถูกต้องแล้วว',
        icon: 'success',
        confirmButtonText: 'GO!'
      })
      setScore(score + 1);
      
      if (score >= bestScore.current) {
        bestScore.current = bestScore.current + 1;
      }

    } else {
      Swal.fire({
        title: word + " แปลว่า " + answer,
        text: 'This is correct answer',
        icon: 'error',
        confirmButtonText: 'I\'ll try again!'
      })
      // alert("Correct Answer : " + answer);
      setMistake(mistake + 1);
      setHardLevel(3);
      setScore(0);
    }

    // get hard lvl
    
    if (score % 10 == 0) {
      console.log("score"+score);
      setHardLevel(hardLevel + 1);
      
    }

    findingWord();
  }

  const selectAnswer = (key: number, val: string) => {
    setAnswerKey(key);
    setAnswerVal(val);
  }

  const findingWord = async () => {
    setStartState(true);

    // if (!randomState) {

    // Reset random
    setChoice([]);

    setRandomState(true)
    setInitState(true)
    setLoading(true)

    

    console.log(hardLevel);

    // Random answer word
    // vocabRandom();
    let randWord: any = generate({minLength: hardLevel})

    setWord(randWord)

    await translate(randWord, { to: "th", corsUrl: ipServer + ":8080/" })
      .then((res: { text: SetStateAction<string>; }) => {
        //console.log(res.text)
        setAnswer(res.text)
        console.info("Answer OK")
      }).catch((err: any) => {
        console.error(err);
        setError(true);
      })

    // Random other choice
    // choiceMake();
    let randWordMany: any = generate(3)
    // let currentList: string[] = [];

    for (let i = 0; i < 3; i++) {
      await translate(randWordMany[i], { to: "th", corsUrl: ipServer + ":8080/" })
        .then((res: { text: SetStateAction<string>; }) => {


          setChoice((prevItem: any) => {
            // currentList.push(res.text.toString())

            if (prevItem.length === 0) {
              return [res.text]
            } else {
              return [...prevItem, res.text]
            }

          })


          //setSpy([...spy, res.text])
          console.log(res.text);

        }).catch((err: any) => {
          console.error(err);
          setError(true);
        })
    }

    setLoading(false)
  // }

  }

  useEffect(() => {
    if (initRandomState) {
      console.info("new state...")
      setInitState(false)
    } else {

      console.log("current queue => " + choiceCounting)
      console.log("current random => " + currentQueue)
      console.log("state => " + randomState)


      if (choiceCounting === currentQueue && randomState) {
        // random choice
        // get current selection
        let selection = [...choice];

        selection.push(answer);
        console.log("Inserting... => " + answer)

        setChoice(selection);

        setCounting(0)
        setQueue(Math.floor(Math.random() * 4))

        setRandomState(false)
      }

      if (randomState) {
        setCounting(choiceCounting + 1);
      } else {
        setCounting(0)
      }
    }
  }, [answer, choice])

  interface sendAnswerWow {
    key: number,
    val: string
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Score&nbsp;
          <code className="font-mono font-bold">{score}</code> &nbsp;| 
          Mistake&nbsp;
          <code className="font-mono font-bold text-red-400">{mistake}</code> &nbsp;| 
          Best Score&nbsp;
          <code className="font-mono font-bold text-lime-400">{bestScore.current}</code>
        </p>
        <div className="hidden lg:inline fixed bottom-0 left-0 flex h-0 w-full items-end justify-center from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            Google Translate API
          </a>
        </div>
      </div>

      <div className="relative z-[-1] place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <h1 className="text-4xl">{word}</h1>
        <br />
        <hr />
        <br />
        {/* <p className="text-center">{answer}</p> */}
      </div>

      {
          (!startState) ? (
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        
          <a
            href="#"
            onClick={() => findingWord()}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors bg-blue-800 hover:border-gray-300 hover:bg-blue-100 hover:dark:border-neutral-700 hover:dark:bg-blue-800/30"
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl font-semibold text-center flex ">
            <i className="bi bi-caret-right"></i>
              Start

            </h2>
          </a>
          
        <br />
        {/* <hr /> */}
        <br />

        {/* <a
          href="#"
          onClick={() => vocabRandom()}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Random{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </a>

        <a
          href="#"
          onClick={() => choiceMake()}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Crud{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </a> */}

        {/* <hr /> */}


      </div>
      ) :
      <></>

    }

      <div className="choice mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        { (!loading) ? choice.map((val, key) => (
          <>
            <a
              href="#"
              key={key}
              // onClick={() => answerQuestion(val)}
              onClick={() => selectAnswer(key, val)}
              className={((key == answerKey) ? "bg-blue-800 border-blue-400 hover:bg-blue-500 hover:dark:border-neutral-700" : "hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30") + " group rounded-lg border border-transparent px-5 py-4 transition-colors "}
              rel="noopener noreferrer"
            >
              <h2 className="mb-3 text-2xl font-semibold">
              <i className="bi bi-arrow-right-short"></i>
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  {val}
                </span>
              </h2>
            </a>
            <br />
            
          </>
        )) : <>Loading...</>}
        {(error) ? <>
          <h1 className="text-red-600 text-5xl">
            <b>An Error Happen!</b>
          </h1>
        </> : <></>}
       {
        (startState && !loading) ? <> <a onClick={() => answerQuestion(answerVal)} className="rounded-lg cursor-pointer font-bold text-center bg-blue-600 border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-blue-800/30">
          <i className="bi bi-send-fill"></i>&nbsp;
          Send Answer</a></> : <></>
       }
      </div>

    </main>
    </>
  );
}