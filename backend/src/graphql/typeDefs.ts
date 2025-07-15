import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the base schema file.
const baseSchemaPath = loadFilesSync(join(__dirname, 'base.graphql'));

const typesArray = loadFilesSync(join(__dirname, '../features/**/*.graphql'));
typesArray.push(baseSchemaPath);
export const typeDefs = mergeTypeDefs(typesArray);