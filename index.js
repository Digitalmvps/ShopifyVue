#! /usr/bin/env node
import { program } from 'commander'
import create from './commands/create.js';

program.command('create <appName>')
.description("Create a VueJs template for a shopify app based on the selected backend language")
.option('-b, --backend <backend>', 'To specify the backend language create-app should use','nodejs')
.action(create);

program.parse();


