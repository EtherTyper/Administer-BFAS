import bfas from "./BFAS.json" assert { type: "json" };

// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let quiz = [];
const results = {};
const minimum = {};

for (const trait in bfas.Aspects) {
  for (const aspect of bfas.Aspects[trait]) {
    if (
      !(aspect in bfas.Items) || Object
          .values(bfas.Items[aspect])
          .map((i) => i.length - 1)
          .reduce((a, b) => a + b) !== 10
    ) {
      console.log("Question validation failed.");
      Deno.exit(1);
    }

    results[aspect] = 0;
    minimum[aspect] = 0;

    for (const [weight, ...questions] of bfas.Items[aspect]) {
      minimum[aspect] += (weight === -1 ? -5 : 1) * questions.length;
      for (const question of questions) {
        quiz.push([question, weight, aspect]);
      }
    }

    results[aspect] -= minimum[aspect]; // Scale from 0 to 40 for each aspect.
  }
}

shuffleArray(quiz);

for (const [question, weight, aspect] of quiz) {
  let number;
  do {
    number = parseInt(prompt(question));
  } while (!(typeof number === 'number' && 1 <= number && number <= 5));
  // let number = 3 - 2 * weight; // Minimum
  // let number = 3 + 2 * weight; // Maximum

  results[aspect] += weight * number;
}

let big5Results = {};

for (const trait in bfas.Aspects) {
  big5Results[trait] = bfas.Aspects[trait].map(aspect => results[aspect]).reduce((a, b) => a + b);
}

console.log(results);
console.log(big5Results);
