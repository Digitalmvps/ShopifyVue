import shell from 'shelljs';
import { infoMessage, fullAppDir, copyFileOrFolder, successMessage, waitMessage, setAppName } from './common.js';

export default function php (appName) {
	  setAppName(appName);
	 if (!shell.which('composer')) {
		shell.echo('Sorry, this script requires composer');
		shell.exit(1);
	  } else {
		 // install laravel 8
		 infoMessage('Installing laravel')
	     shell.exec(`composer create-project laravel/laravel:^8.0 ${appName}`)

		// clone vue-typescript-template
		infoMessage('Cloning vue-typescript-template')
	    shell.exec(`git clone https://github.com/Doctordrayfocus/vue-typescript-template.git ${appName}/temp`)

		// configuring template
		infoMessage("Configuring template")

		// setting up vite
		infoMessage('Setting up laravel vite')
		shell.exec(`cd ${fullAppDir} &&  npx @preset/cli apply laravel:vite -e`)

		// remove scripts folder
		shell.rm('-rf', `${fullAppDir}/resources/scripts`)

		// set script files
		copyFileOrFolder(`${fullAppDir}/temp/src/.`,'resources/scripts', false, true);

		// update welcome.blade.php
		copyFileOrFolder('/bin/php/welcome.blade.php', 'resources/views/welcome.blade.php');

		// update BaseService.ts
		copyFileOrFolder('/bin/php/BaseService.ts', 'resources/scripts/services/common/BaseService.ts');

		// update package.json
		copyFileOrFolder('/bin/php/package.json', 'package.json');

		// update vite.config.ts
		copyFileOrFolder('/bin/php/vite.config.ts', 'vite.config.ts');

		// remove redundant files
		shell.rm('-rf', `${fullAppDir}/temp`)

		// install laravel-shopfy package
		infoMessage("Installing laravel-shopify package")
		waitMessage('Please Wait')
		shell.exec(`composer require osiset/laravel-shopify --working-dir=${fullAppDir}`)

		successMessage('Template generated!')
		console.log(`change directory to '${appName}'`)
		console.log(` `)
		console.log(`Run 'npm install'`)
		console.log(` `)
		console.log(`run`)
		infoMessage('npm run watch')
		console.log(`To start your developement server`)
	  }
}

