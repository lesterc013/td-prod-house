import { documents } from './documents.js';

const EMBEDDING_MODEL = 'nomic-embed-text';
const EMBEDDING_ENDPOINT = 'http://localhost:11434/api/embed';

async function getEmbedding(model, input) {
  const res = await fetch(EMBEDDING_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      model,
      input,
    }),
  });

  return await res.json();
}

const embeddings = new Map();

for (const d of documents) {
  const e = await getEmbedding(EMBEDDING_MODEL, d);
  embeddings.set(d, e);
}

console.log(embeddings);
