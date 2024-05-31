const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';
const dotenv = require('dotenv').config({ path: 'src/.env' });;

const envFile = `export const environment = {
    endpoint: '${process.env.ENDPOINT}',
    projectId: '${process.env.PROJECT_ID}',
    databaseId: '${process.env.DATABASE_ID}',
    chatCollectionId: '${process.env.COLLECTION_ID}',
    prod: true
 };
`;
const targetPath = path.join(__dirname, './src/environments/environment.development.ts');
fs.writeFile(targetPath, envFile, (err) => {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.log(successColor, `${checkSign} Successfully generated environment.development.ts`);
    }
});