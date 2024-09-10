import * as fs from 'fs';
import * as path from 'path';

export {
    getRouter as getRouter,
    getPrefix as getPrefix
}

function getAllFiles(folderPath: string) {
    const allFiles: string[] = []
    const files = fs.readdirSync(folderPath)
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            const subdirectoryFiles = getAllFiles(filePath);
            allFiles.push(...subdirectoryFiles); 
        } else {
            allFiles.push(filePath);
        }
    })
    return allFiles;
}

function getRouter() {
    return getAllFiles(path.join(__dirname, 'apis'));
}

// function getPrefix(file: string) {
//     return file.replace(__dirname + '\\', '').replaceAll('\\', '/').replace(".ts", "").replace(".js", "");
// }

function getPrefix(file: string) {
    const normalizedPath = path.normalize(file);
    const relativePath = path.relative(__dirname, normalizedPath);
    const withoutExtension = relativePath.replace(/\.(ts|js)$/, '');
    const unixStylePath = withoutExtension.replace(/\\/g, '/');
    
    return unixStylePath;
}