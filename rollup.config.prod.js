import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupTypescript from '@rollup/plugin-typescript';
import babel from 'rollup-plugin-babel';
import glslify from 'rollup-plugin-glslify';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';

import { uglify } from 'rollup-plugin-uglify';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/gl-edit.min.js',
        format: 'umd',
        name: 'glEdit',
        globals: {
            'L':'L',
            'regl':'regl'
        }
    },
    plugins: [
        rollupTypescript({
            allowSyntheticDefaultImports: true
        }),
        babel({
            exclude: "node_modules/**"
        }),
        nodeResolve(),
        glslify(),
        commonjs(),
        image(),
        json(),
        uglify(),
    ],
    external: [
        'leaflet',
        'regl'
    ]
};