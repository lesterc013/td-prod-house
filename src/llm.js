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

export { getEmbedding, generateReply };
