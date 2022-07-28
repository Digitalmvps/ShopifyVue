import shell from 'shelljs';
import { infoMessage, copyFileOrFolder, successMessage, fullAppDir, setAppName, waitMessage } from './common.js';

export default function nodejs (appName) {
	setAppName(appName);
	  if (!shell.which('git')) {
		shell.echo('Sorry, this script requires git');
		shell.exit(1);
	  } else {
		// clone vue-typescript-template
		infoMessage('Cloning vue-typescript-template')
	    shell.exec(`git clone https://github.com/Doctordrayfocus/vue-typescript-template.git ${appName}`)

		// configuring template
		infoMessage("configuring template")

		// update vite.config.ts
		copyFileOrFolder('/bin/nodejs/vite.config.ts', 'vite.config.ts');

		// update package.json
		copyFileOrFolder('/bin/nodejs/package.json', 'package.json');

		// update tsconfig.json
		copyFileOrFolder('/bin/nodejs/tsconfig.json', 'tsconfig.json');

		// update index.html
		copyFileOrFolder('/bin/nodejs/index.html', 'index.html');

		// update .env.example
		copyFileOrFolder('/bin/nodejs/.env.example', '.env.example');

		// update .env.test
		copyFileOrFolder('/bin/nodejs/.env.test', '.env.test');

		// update BaseService.ts
		copyFileOrFolder('/bin/nodejs/BaseService.ts', 'src/services/common/BaseService.ts');

		// create server files
		copyFileOrFolder('/bin/nodejs/server', 'server', true, true);

		// install packages
		infoMessage("Installing packages")
		waitMessage('Please Wait')

		// remove package-lock.json
		shell.exec(`cd ${fullAppDir} && rm package-lock.json`)

		successMessage('Template generated!')
		console.log(`change directory to '${appName}'`)
		console.log(` `)
		console.log(`Run 'npm install'`)
		console.log(` `)
		console.log(`Add a .env file`)
		console.log(` `)
		console.log(`then, run:`)
		infoMessage('npm run serve:dev')
		console.log(`To start your developement server`)

	  }
}

