// tslint:disable:no-console

import program from "commander";
import * as exporter from ".";
import { version } from "../package.json";
import { csvFormatter } from "./formatters";

program
  .version(version)
  .arguments("[database] [object]")
  .action((db, object) => {
    exporter
      .load(db)
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
  });

program.parse(process.argv);
