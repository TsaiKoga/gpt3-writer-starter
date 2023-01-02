import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import {useState} from 'react';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiOutput, setApiOutput] = useState('');

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("calling OpenAI...");
    const response = await fetch('/api/generate', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const {output} = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  return (
    <div className="root">
      <Head>
        <title>Programing Assistant</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Programing Assistant</h1>
          </div>
          <div className="header-subtitle">
            <h2>Describe the detail of your problem, and provide your environment, package versions, etc.</h2>
          </div>
        </div>
      </div>

      <div className="prompt-container">
        <textarea
        className="prompt-box"
        placeholder="start typing here"
        value={userInput}
        onChange={onUserChangedText}
        />;
        <div className="prompt-buttons">
          <a className="generate-button" onClick={callGenerateEndpoint}>
            <div className="generate">
              <p>Generate</p>
            </div>
          </a>
        </div>

        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >

          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
