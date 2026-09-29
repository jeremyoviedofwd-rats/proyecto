import fs from 'fs';
import path from 'path';

const sourceDir = 'C:\\Users\\U!\\.gemini\\antigravity-ide\\brain\\68c7e033-a124-4548-bc5e-3e579a4704fe';
const targetDir = 'C:\\Users\\U!\\Desktop\\proyecto\\proyecto-front\\public\\images';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const mappings = [
    { src: 'spa_hero_1790366750761.jpg', dest: 'spa_hero.jpg' },
    { src: 'facial_treatment_1790366765302.jpg', dest: 'facial.jpg' },
    { src: 'massage_therapy_1790366778287.jpg', dest: 'massage.jpg' },
    { src: 'body_treatment_1790366798338.jpg', dest: 'body.jpg' }
];

mappings.forEach(({ src, dest }) => {
    const srcPath = path.join(sourceDir, src);
    const destPath = path.join(targetDir, dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${src} to ${destPath}`);
    } else {
        console.error(`Source file not found: ${srcPath}`);
    }
});
