#!/usr/bin/env node

import program from "commander";
import { version } from '../package.json';

program
  .version(version)
  .command('export <database> <object>', 'Exports the database object to a more common format')
  .command('objects <database>', 'Lists all objects available on the database')
  .parse(process.argv);
