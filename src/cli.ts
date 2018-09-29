import program from 'commander';
import { version } from '../package.json'
import * as exporter from '.'
import { csvFormatter } from './formatters'

program
  .version(version)
  .arguments("[database] [object]")
  .action((db, object) => {
    exporter.load(db)
      .then(exporter.select(object))
      .then(csvFormatter)
      .then(csvGenerator => {
        for (let line of csvGenerator) {
          console.log(line);
        }

        process.exit();
      })
      .catch((error) => {
        console.error(error.message);
        process.exit(1)
      })
  });

program.parse(process.argv);
