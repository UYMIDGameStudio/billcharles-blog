import { streamText } from 'ai';

async function main() {
  const result = streamText({
    model: 'openai/gpt-5.5',
    prompt: '用简单易懂的中文解释什么是量子计算？',
  });

  console.log('🤖 AI 正在思考并生成回答...\n');

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
}

main().catch(console.error);
