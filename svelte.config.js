import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: vitePreprocess(),
	env:{
		privatePrefix: "PRIVATE_"
	}
};
export default config;
