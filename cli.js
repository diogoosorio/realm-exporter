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
      .then(exporter.translators.CSV)
      .then(console.log);
  });

program.parse(process.argv)