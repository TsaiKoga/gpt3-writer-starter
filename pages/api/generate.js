import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// 为问题增加一些要求，然后通过 Problem 指定用户的输入
const basePromptPrefix =
`
Please show all the factors that cause such problems.

Problem:
`;

const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // 创建第二个问题
  const secondPrompt =
  `
  Take the those factors and give solutions accordingly.

  Problem: ${req.body.userInput}

  Factors: ${basePromptOutput.text}

  Solutions:
  `

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.85,
    max_tokens: 1250,
  });

  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({output: secondPromptOutput});
}

export default generateAction;
