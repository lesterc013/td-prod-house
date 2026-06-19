import { documents, queries } from '../data/hardcodedTests.js';
import config from './config.js';

async function getEmbedding(input) {
  const res = await fetch(config.EMBEDDING_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      model: config.EMBEDDING_MODEL_NAME,
      input,
    }),
  });

  return await res.json();
}

async function generateReply(query, topDocuments) {
  // Create the prompt
  // Call the api with fetch and the message body
  const res = await fetch(config.GENERATE_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      model: config.GENERATE_MODEL_NAME,
      system: config.SYSTEM_PROMPT,
      prompt: buildPrompt(query, topDocuments),
    }),
  });

  // Get the body - which is a pipe actually. A pipe of data.
  const reader = res.body.getReader();
  const decoder = new TextDecoder(); // One chunk of bytes at a time

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('\nCompleted reading.');
      break;
    }

    // value returned from ReadableStream are bytes which need to be decoded.
    const resObj = JSON.parse(decoder.decode(value));
    process.stdout.write(resObj.response);
  }
}

function calcCosineSimilarity(a, b) {
  // Dot product is for each ele of a and b, multiply them together. Then sum them all up
  const dotProduct = getDotProduct(a, b);
  // Magnitude is square each element, sum them, then sqrt
  const magA = getMagnitude(a);
  const magB = getMagnitude(b);
  return dotProduct / (magA * magB);
}

function getDotProduct(a, b) {
  if (a.length !== b.length) {
    console.log('Error. Vector lengths not the same.');
    return null;
  }

  let dotProduct = 0;
  for (let i = 0; i < a.length; i++) {
    const numA = a[i];
    const numB = b[i];
    const product = numA * numB;
    dotProduct += product;
  }
  return dotProduct;
}

function getMagnitude(vector) {
  let totalSquaredSum = 0;
  vector.forEach((element) => {
    const squared = element * element;
    totalSquaredSum += squared;
  });
  return Math.sqrt(totalSquaredSum);
}

function buildPrompt(query, topDocuments) {
  let contextString = '<context>\n';
  for (const doc of topDocuments) {
    contextString += `${doc.document}\n`;
    contextString += `---\n`;
  }
  contextString += '</context>\n';

  // Then add the query
  let queryString = `Please answer the following question based ONLY on the reference information above. If the answer cannot be found in the context, state exactly: "Not found in database."\n Question: ${query}`;

  return contextString.concat(queryString);
}

// Storing hardcoded documents' embeddings in embeddings.
const documentEmbeddings = new Map();
for (const d of documents) {
  const e = await getEmbedding(d);
  documentEmbeddings.set(d, e);
}

// Hardcoded testing of the query -> answer pipeline
for (const q of queries) {
  const qEmbedding = await getEmbedding(q);
  const qVector = qEmbedding.embeddings[0];

  const results = [];
  for (const [doc, docResponse] of documentEmbeddings) {
    const docVector = docResponse.embeddings[0];
    const score = calcCosineSimilarity(qVector, docVector);
    results.push({ document: doc, score });
  }

  const topThree = results.toSorted((a, b) => b.score - a.score).slice(0, 3);
  console.log(`Generating response for query: ${q}`);
  await generateReply(q, topThree);
  console.log();
}
