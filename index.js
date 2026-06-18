import { documents, queries } from './hardcodedTests.js';

const EMBEDDING_MODEL = 'nomic-embed-text';
const EMBEDDING_ENDPOINT = 'http://localhost:11434/api/embed';

async function getEmbedding(input) {
  const res = await fetch(EMBEDDING_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input,
    }),
  });

  return await res.json();
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

// Storing hardcoded documents' embeddings in embeddings.
const embeddings = new Map();
for (const d of documents) {
  const e = await getEmbedding(d);
  embeddings.set(d, e);
  console.log(e.embeddings[0].length);
}

for (const q of queries) {
  const qEmbedding = await getEmbedding(q);
  const qVector = qEmbedding.embeddings[0];

  const results = [];
  for (const [doc, docResponse] of embeddings) {
    const docVector = docResponse.embeddings[0];
    const score = calcCosineSimilarity(qVector, docVector);
    results.push({ document: doc, score });
  }

  results.sort((a, b) => b.score - a.score);

  console.log(`\nQuery: "${q}"`);
  results.forEach((r, i) => {
    console.log(
      `  ${i + 1}. [${r.score.toFixed(4)}] ${r.document.slice(0, 80)}...`,
    );
  });
}
