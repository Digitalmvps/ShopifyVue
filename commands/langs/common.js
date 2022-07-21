import chalk from 'chalk'
import shell from 'shelljs';
import fse from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

let fullAppDir = '';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const currentDir = shell.exec('pwd',{silent:true}).stdout;

const setAppName = (appName) => {
	fullAppDir =  currentDir.substring(0, currentDir.length - 1) + `/${appName}`;
}

const infoMessage = (msg) => {
	console.log(chalk.bgBlue(msg))
}

const waitMessage = (msg) => {
	console.log(chalk.bgMagenta(msg))
}

const errorMessage = (msg) => {
	console.log(chalk.bgRed(msg))
}

const successMessage = (msg) => {
	console.log(chalk.bgGreen(msg))
}

const copyFileOrFolder = (source, destination, useRootDir = true) => {
	fse.copySync( `${ useRootDir ? __dirname + source : '' + source}`, `${fullAppDir + '/' + destination}`, {overwrite: true}, function (err) {
		if (err) {
			errorMessage(console.error(err)); 
		} else {
			successMessage(destination + " configured");
		}
	});	
}

export {
	infoMessage,
	errorMessage,
	successMessage,
	copyFileOrFolder,
	setAppName,
	waitMessage,
	fullAppDir
}