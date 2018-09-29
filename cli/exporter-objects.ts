// tslint:disable:no-console

import program from "commander";
import * as fs from "fs";
import * as exporter from "../src";

program.arguments("<database>").parse(process.argv);

const [database] = program.args

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
    objects.forEach((obj) => console.log(obj));
    process.exit();
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
