import shell from "shelljs";
import {
  infoMessage,
  fullAppDir,
  copyFileOrFolder,
  successMessage,
  waitMessage,
  setAppName,
} from "./common.js";

export default function php(appName) {
  setAppName(appName);
  if (!shell.which("composer")) {
    shell.echo("Sorry, this script requires composer");
    shell.exit(1);
  } else {
    // install laravel 8
    infoMessage("Installing laravel");
    shell.exec(`composer create-project laravel/laravel:^8.0 ${appName}`);

    // clone vue-typescript-template
    infoMessage("Cloning vue-typescript-template");
    shell.exec(
      `git clone https://github.com/Doctordrayfocus/vue-typescript-template.git ${appName}/temp`
    );

    // configuring template
    infoMessage("Configuring template");

    // remove scripts folder
    shell.rm("-rf", `${fullAppDir}/resources/js`);

    // set script files
    copyFileOrFolder(`${fullAppDir}/temp/src/.`, "resources/js", false, true);

    // update welcome.blade.php
    copyFileOrFolder(
      "/bin/php/welcome.blade.php",
      "resources/views/welcome.blade.php"
    );

    // update BaseService.ts
    copyFileOrFolder(
      "/bin/php/BaseService.ts",
      "resources/js/services/common/BaseService.ts"
    );

    // update package.json
    copyFileOrFolder("/bin/php/package.json", "package.json");

    // update webpack.mix.js
    copyFileOrFolder("/bin/php/webpack.mix.js", "webpack.mix.js");

    // copy tsconfig.json
    copyFileOrFolder("/bin/php/tsconfig.json", "tsconfig.json");

    // copy .d.ts
    copyFileOrFolder("/bin/php/.d.ts", ".d.ts");

    // remove redundant files
    shell.rm("-rf", `${fullAppDir}/temp`);

    // install laravel-shopfiy package
    infoMessage("Installing laravel-shopify package");
    waitMessage("Please Wait");
    shell.exec(
      `composer require kyon147/laravel-shopify --working-dir=${fullAppDir}`
    );

    successMessage("Template generated!");
    console.log(`change directory to '${appName}'`);
    console.log(` `);
    console.log(`Run 'npm install'`);
    console.log(` `);
    console.log(`Then run 'npm run watch'`);
    console.log(`To start your developement server`);
  }
}
