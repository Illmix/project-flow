import { readFileSync } from 'fs';
import { globSync } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the base schema file.
const baseTypeDefs = readFileSync(join(__dirname, 'base.graphql'), { encoding: 'utf-8' });

const featuresDirectory = join(__dirname, '../features');

// Find all .graphql files within the 'features' directory.
const featureSchemaFilePaths = globSync('**/*.graphql', {
    cwd: featuresDirectory,
    absolute: true, // This ensures glob returns the full, absolute path to the files.
});

// Read the content of each found file.
const featureTypeDefs = featureSchemaFilePaths.map((filePath) =>
    readFileSync(filePath, { encoding: 'utf-8' })
);


export const typeDefs = [baseTypeDefs, ...featureTypeDefs];