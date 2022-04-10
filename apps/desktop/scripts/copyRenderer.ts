import fs from 'fs-extra';
import path from 'path';

const rendererPath = path.join(__dirname, '../../web/dist');
const targetPath = path.join(__dirname, '../dist/renderer');

fs.removeSync(targetPath);
fs.copySync(rendererPath, targetPath);
