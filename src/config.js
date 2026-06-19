const EMBEDDING_MODEL_NAME = 'nomic-embed-text';
const EMBEDDING_ENDPOINT = 'http://localhost:11434/api/embed';

const GENERATE_MODEL_NAME = 'qwen2.5:14b';
const GENERATE_ENDPOINT = 'http://localhost:11434/api/generate';

const SYSTEM_PROMPT =
  "You are a helpful assistant. Answer ONLY using the provided context. If the answer is not in the context, reply with: 'Not found in database.' but also list out the documents that were provided to you as context in the prompt so the user can reference them in case there is something useful for them there.";

const config = {
  EMBEDDING_MODEL_NAME,
  EMBEDDING_ENDPOINT,
  GENERATE_MODEL_NAME,
  GENERATE_ENDPOINT,
  SYSTEM_PROMPT,
};

export default config;
