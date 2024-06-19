import fs from 'fs';

// const text = fs.readFileSync('../txt/input.txt', 'utf-8');

// console.log(text);

// const output = `my name is lam`;

// fs.writeFileSync('../txt/out.txt', output);

// // non-blocking
// fs.readFile('../txt/start.txt', 'utf-8', (err, data) => {
//   console.log(data);
// });

// fs.writeFile('../txt/start.txt', 'data write', 'utf-8', err => {
//   console.log(err);
// });

const filePath = '../txt/input.txt';

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, 'Initial content');
}
