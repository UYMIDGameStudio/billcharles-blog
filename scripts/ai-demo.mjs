import { streamText } from 'ai';

async function main() {
  let streamError;
  const result = streamText({
    model: 'openai/gpt-5.5',
    prompt: '用简单易懂的中文解释什么是量子计算？',
    onError: ({ error }) => {
      streamError = error;
    },
  });

  console.log('🤖 AI 正在思考并生成回答...\n');

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }

  const finishReason = await result.finishReason;
  if (streamError) throw streamError;
  if (finishReason === 'error') throw new Error('AI generation failed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
