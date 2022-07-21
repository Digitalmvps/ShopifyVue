import chalk from 'chalk'
import php from './langs/php.js'
import nodejs from './langs/nodejs.js'

const availbleLanguages = [
	'php',
	'nodejs'
];

export default function create (appName, {backend}) {
	if(availbleLanguages.indexOf(backend) > -1) {
		switch (backend) {
			case 'php':
				php(appName)
				break;
			case 'nodejs':
				nodejs(appName)
				break;
			default:
				break;
		}
	} else {
		console.log(chalk.bgRed(`${backend} backend is not suppoted`));
	}
}

