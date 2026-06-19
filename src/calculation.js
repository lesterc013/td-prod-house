export default function calcCosineSimilarity(a, b) {
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
