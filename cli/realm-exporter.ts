#!/usr/bin/env node

// tslint:disable:no-console

import program from "commander";
import { version } from "../package.json";
import * as fs from "fs";
import * as exporter from "../src";
import { csvFormatter } from "../src/formatters";

program.version(version);

program
  .command("export <database> <object>")
  .description("Exports the database object to a more common format")
  .action((database, objectType) => {
    if (!database) {
      console.error("The database argument is required");
      process.exit(1);
    }

    if (!fs.existsSync(database)) {
      console.error(`The database file ${database} doesn't exist`);
      process.exit(1);
    }

    if (!objectType) {
      console.error("The database object to be exported is required");
      process.exit(1);
    }

    exporter
      .load(database)
      .then(exporter.select(objectType))
      .then(csvFormatter)
      .then(csvGenerator => {
        for (const line of csvGenerator) {
          console.log(line);
        }

        process.exit();
      })
      .catch(error => {
        console.error(error.message);
        process.exit(1);
      });
  });

program
  .command("objects <database>")
  .description("Lists all objects available on the database")
  .action(database => {
    if (!database) {
      console.error("The database argument is required");
      process.exit(1);
    }

    if (!fs.existsSync(database)) {
      console.error(`The database file ${database} doesn't exist`);
      process.exit(1);
    }

    exporter
      .load(database)
      .then(exporter.getObjectNames)
      .then(objects => {
        objects.forEach(obj => console.log(obj));
        process.exit();
      })
      .catch(error => {
        console.error(error.message);
        process.exit(1);
      });
  });

program.parse(process.argv);