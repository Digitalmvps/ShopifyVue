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

	var strFirstTwo = fullAppDir.substring(0,2);

	// for windows
	if(strFirstTwo == '/c') {
		fullAppDir = 'c:' + fullAppDir.substring(2);
	}
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

const copyFileOrFolder = (source, destination, useRootDir = true, isfolder = false) => {
	shell.exec(`cp ${isfolder ? '-r -f' : '-f'} ${ useRootDir ? __dirname + source : '' + source} ${fullAppDir + '/' + destination}`)
}

export {
	infoMessage,
	errorMessage,
	successMessage,
	copyFileOrFolder,
	setAppName,
	waitMessage,
	fullAppDir,
	__dirname
}