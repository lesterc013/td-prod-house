import ollama from 'ollama';

const EMBEDDING_MODEL = 'nomic-embed-text';
const EMBEDDING_ENDPOINT = 'http://localhost:11434/api/embed';

function createEmbeddingRequest(model, input) {
  return {
    model,
    input,
  };
}

const res = await fetch(EMBEDDING_ENDPOINT, {
  method: 'POST',
  body: JSON.stringify(
    createEmbeddingRequest(
      EMBEDDING_MODEL,
      'the brown fox jumped over the stone',
    ),
  ),
});

const singleEmbedding = await res.json();
console.log(singleEmbedding.embeddings[0].length);
