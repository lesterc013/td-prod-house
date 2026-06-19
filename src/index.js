import { documents, queries } from '../data/hardcodedTests.js';
import calcCosineSimilarity from './calculation.js';
import { getEmbedding, generateReply } from './llm.js';

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
