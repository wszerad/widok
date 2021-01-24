import vue from '@vitejs/plugin-vue';
import path from 'path';

export default {
	plugins: [
		vue()
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'index.ts'),
			name: 'Widok'
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
}
