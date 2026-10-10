
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const pastaOrigem = path.resolve('img');
const pastaDestino = path.resolve('img-otimizadas');

await mkdir(pastaDestino, { recursive: true });

const arquivos = (await readdir(pastaOrigem))
  .filter((arquivo) => /\.(jpe?g|png)$/i.test(arquivo));

let totalOriginal = 0;
let totalConvertido = 0;

for (const arquivo of arquivos) {
  const origem = path.join(pastaOrigem, arquivo);
  const nomeWebp = `${path.parse(arquivo).name}.webp`;
  const destino = path.join(pastaDestino, nomeWebp);

  await sharp(origem)
    .rotate()
    .webp({ quality: 80, effort: 5 })
    .toFile(destino);

  const tamanhoOriginal = (await stat(origem)).size;
  const tamanhoConvertido = (await stat(destino)).size;

  totalOriginal += tamanhoOriginal;
  totalConvertido += tamanhoConvertido;

  console.log(
    `${arquivo}: ${(tamanhoOriginal / 1024 / 1024).toFixed(2)} MB → ` +
    `${nomeWebp}: ${(tamanhoConvertido / 1024 / 1024).toFixed(2)} MB`
  );
}

const reducao = totalOriginal > 0
  ? (1 - totalConvertido / totalOriginal) * 100
  : 0;

console.log('\n--- Resultado ---');
console.log(`Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
console.log(`WebP: ${(totalConvertido / 1024 / 1024).toFixed(2)} MB`);
console.log(`Redução total: ${reducao.toFixed(2)}%`);
