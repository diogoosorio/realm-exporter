#!/usr/bin/env node

const program = require("commander");
const version = require("./package.json").version;
const exporter = require(".");

program
  .version(version)
  .command("realm-exporter [database] [object]")
  .action((db, object) => {
    exporter
      .load(db)
      .then(exporter.select(object))
      .then(exporter.format.csv)
      .then(csvGenerator => {
        for (let line of csvGenerator()) {
          console.log(line);
        }

        process.exit();
      });
  });

program.parse(process.argv);
