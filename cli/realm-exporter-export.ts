// tslint:disable:no-console

import program from "commander";
import * as fs from "fs";
import * as exporter from "../src";
import { csvFormatter } from "../src/formatters";

program.arguments("<database> <object>").parse(process.argv);

const [database, object] = program.args

if (!database) {
  console.error("The database argument is required");
  process.exit(1);
}

if (!fs.existsSync(database)) {
  console.error(`The database file ${database} doesn't exist`)
  process.exit(1);
}

if (!object) {
  console.error("The database object to be exported is required");
  process.exit(1);
}

exporter
  .load(database)
  .then(exporter.select(object))
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
