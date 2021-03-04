import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupTypescript from '@rollup/plugin-typescript';
import babel from 'rollup-plugin-babel';
import glslify from 'rollup-plugin-glslify';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/leaflet-draw-edit.dev.js',
        format: 'umd',
        name: 'L.drawEdit',
        globals: {
            leaflet:'L'
        }
    },
    plugins: [
        glslify(),
        rollupTypescript({
            allowSyntheticDefaultImports: true
        }),
        babel({
            exclude: "node_modules/**"
        }),
        nodeResolve(),
        commonjs(),
    ],
    external: [
        'leaflet'
    ]
};