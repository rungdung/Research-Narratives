const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: '#faebd7',
					100: '#f5d0b9',
					200: '#efb49a',
					300: '#e9987b',
					400: '#e47c5c',
					500: '#de6043',
					600: '#b84a34'
				},
				inputField: {
					50: '#748382',
					100: '#a4afae',
					200: '#dbdfdf'
				}
			}
		}
	}
};

module.exports = config;
