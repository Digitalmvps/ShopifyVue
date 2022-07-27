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
		infoMessage("configuring template")

		// remove webpack.mix.js
		shell.rm('-rf', `${fullAppDir}/webpack.mix.js`)

		// set script files
		copyFileOrFolder(`${fullAppDir}/temp/src`,'resources/scripts', false, true);

		// update welcome.blade.php
		copyFileOrFolder('/bin/php/welcome.blade.php', 'resources/views/welcome.blade.php');
	
		// update vite.config.ts
		copyFileOrFolder('/bin/php/vite.config.ts', 'vite.config.ts');

		// update package.json
		copyFileOrFolder('/bin/php/package.json', 'package.json');

		// update BaseService.ts
		copyFileOrFolder('/bin/php/BaseService.ts', 'resources/scripts/services/common/BaseService.ts');

		// remove redundant files
		shell.rm('-rf', `${fullAppDir}/temp`)

		// install npm packages
		infoMessage("Installing npm packages")
		waitMessage('Please Wait')

		// remove package-lock.json
		shell.exec(`cd ${fullAppDir} && rm package-lock.json`)
		shell.exec(`cd ${fullAppDir} && npm install`)

		// install laravel-shopfy package
		infoMessage("Installing laravel-shopify package")
		waitMessage('Please Wait')
		shell.exec(`composer require osiset/laravel-shopify innocenzi/laravel-vite --working-dir=${fullAppDir}`)

		successMessage('Template generated!')
		console.log(`change directory to '${appName}'`)
		console.log(`run`)
		infoMessage('npm run watch')
		console.log(`To start your developement server`)
	  }
}

