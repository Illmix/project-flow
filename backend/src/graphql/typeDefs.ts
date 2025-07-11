import { readFileSync } from 'fs';
import path from 'path';
import { globSync } from 'glob';

// Load the base schema file.
const baseSchemaPath = path.join(__dirname, 'base.graphql');
const baseTypeDefs = readFileSync(baseSchemaPath, { encoding: 'utf-8' });

// Find all .graphql files within the 'features' directory.
const featureSchemasPath = path.join(__dirname, '../features/**/*.graphql');
const featureTypeDefs = globSync(featureSchemasPath).map((filePath) =>
    readFileSync(filePath, { encoding: 'utf-8' })
);

export const typeDefs = [baseTypeDefs, ...featureTypeDefs];