export function getRollupConfiguration(options) {
	return (
		    `
                import resolve from "rollup-plugin-node-resolve";
                import typescript from "rollup-plugin-typescript2";
                import replace from "rollup-plugin-replace";
                import commonjs from "rollup-plugin-commonjs";
                import { uglify } from "rollup-plugin-uglify";
                import postcss from "rollup-plugin-postcss";
                import react from 'react';
                import reactDom from 'react-dom';

                const plugins = [
                    postcss({
                        extensions: [".css"]
                    }),
                    replace({
                        "process.env.NODE_ENV": JSON.stringify("production")
                    }),
                    commonjs({
                        include: "node_modules/**",
                        namedExports: {
                            "node_modules/react-is/index.js": [
                                "isValidElementType",
                                "isContextConsumer"
                            ],
                            "node_modules/redux-dynamic-modules/lib/index.js": ["DynamicModuleLoader"],
                            react: Object.keys(react),
                            'react-dom': Object.keys(reactDom)
                        }
                    }),
                    resolve(),
                    typescript({
                        tsconfig: "tsconfig.rollup.json"
                    })
                ];

                export default [
                    {
                        plugins: [...plugins, uglify()],
                        input: "./src/` + options.componentName + `/index.tsx",
                        external: ["react", "react-dom", "styled-components"],
                        output: {
                            globals: {
                                react: "React",
                                "react-dom": "ReactDOM",
                                "styled-components": "styled"
                            },
                            name: "Artifi.` + options.componentName.split("-").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join("") + `",
                            sourcemap: false,
                            file: "./bundle/` + options.componentName + `.js",
                            format: "iife"
                        }
                    }
                ];
            `
	);
}

export function getTsConfig() {
	return `
            {
                "compilerOptions": {
                "target": "es5",
                "lib": [
                    "dom",
                    "dom.iterable",
                    "esnext"
                ],
                "allowJs": true,
                "skipLibCheck": true,
                "esModuleInterop": true,
                "allowSyntheticDefaultImports": true,
                "strict": true,
                "forceConsistentCasingInFileNames": true,
                "module": "esnext",
                "moduleResolution": "node",
                "resolveJsonModule": true,
                "isolatedModules": true,
                "noEmit": true,
                "jsx": "react"
                },
                "include": [
                "src"
                ]
            }
        `;
}
