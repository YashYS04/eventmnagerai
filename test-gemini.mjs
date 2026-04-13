import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAeMGsDQO0ZCBHGc5Nw9FbT7-xmZ-J5QeY');

async function run() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent("hello");
  console.log(result.response.text());
}
run().catch(console.error);
