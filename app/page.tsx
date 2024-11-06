"use client"

import Image from "next/image";
import { translate } from "google-translate-api-browser"
import { SetStateAction, useEffect, useState } from "react";

import { generate, count } from "random-words";


export default function Home() {
  const [choiceCounting, setCounting] = useState(0);
  const [currentQueue, setQueue] = useState(Math.floor(Math.random() * 4));

  const [randomState, setRandomState] = useState(false);
  const [initRandomState, setInitState] = useState(true);
  const [loading, setLoading] = useState(false);

  const [word, setWord] = useState("Starting Random Word here")
  const [answer, setAnswer] = useState<string>("")
  const [choice, setChoice] = useState<string[]>([])

  const [score, setScore] = useState(0);
  const [mistake, setMistake] = useState(0);

  const vocabRandom = async () => {
    let randWord: any = generate()

    setWord(randWord)

    await translate(randWord, { to: "th", corsUrl: "http://localhost:8080/" })
      .then((res: { text: SetStateAction<string>; }) => {
        //console.log(res.text)
        setAnswer(res.text)
        // console.info("Answer OK")
      }).catch((err: any) => {
        console.error(err);
      })
  }

  const choiceMake = async () => {
    let randWord: any = generate(3)
    // let currentList: string[] = [];

    for (let i = 0; i < 3; i++) {
      await translate(randWord[i], { to: "th", corsUrl: "http://localhost:8080/" })
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
        })
    }

    // console.log("result")
    // console.log( currentList)


  }

  // Answering
  const answerQuestion = (word: string) => {
    if (word === answer) {
      setScore(score + 1);
    } else {
      setMistake(mistake + 1);
    }

    findingWord();
  }

  const findingWord = async () => {

    // Reset random
    setChoice([]);

    setRandomState(true)
    setInitState(true)
    setLoading(true)

    // Random answer word
    // vocabRandom();
    let randWord: any = generate()

    setWord(randWord)

    await translate(randWord, { to: "th", corsUrl: "http://localhost:8080/" })
      .then((res: { text: SetStateAction<string>; }) => {
        //console.log(res.text)
        setAnswer(res.text)
        console.info("Answer OK")
      }).catch((err: any) => {
        console.error(err);
      })

    // Random other choice
    // choiceMake();
    let randWordMany: any = generate(3)
    // let currentList: string[] = [];

    for (let i = 0; i < 3; i++) {
      await translate(randWordMany[i], { to: "th", corsUrl: "http://localhost:8080/" })
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
        })
    }

    setLoading(false)


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
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Score&nbsp;
          <code className="font-mono font-bold">{score}</code> &nbsp;| 
          Mistake&nbsp;
          <code className="font-mono font-bold">{mistake}</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
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

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="#"
          onClick={() => findingWord()}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors bg-blue-800 hover:border-gray-300 hover:bg-blue-100 hover:dark:border-neutral-700 hover:dark:bg-blue-800/30"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
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

      <div className="choice mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        { (!loading) ? choice.map((val, key) => (
          <>
            <a
              href="#"
              key={key}
              onClick={() => answerQuestion(val)}
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              rel="noopener noreferrer"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                {val}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
            </a>
            <br />
          </>
        )) : <>Loading...</>}
      </div>

    </main>
  );
}