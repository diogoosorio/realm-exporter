import * as path from 'path'
import * as exporter from '../src'
import { csvFormatter } from '../src/formatters'
import { expect } from 'chai'
import Realm from 'realm'

const testDbFile = path.join(__dirname, 'tests-db.realm')

describe(".load", () => {
    it("resolves the promise with a realm database instance", done => {
      exporter
        .load(testDbFile)
        .then(realmInstance => {
          expect(realmInstance).to.be.instanceOf(Realm);
          done();
        })
        .catch(done);
    });
  
    context("when the database file doesn't exist", () => {
      it("rejects the promise with the error", done => {
        exporter.load("./non-existent-db.realm").then(done, error => {
          expect(error).to.be.instanceOf(Error);
          done();
        });
      });
    });
  });
  
  describe(".select", () => {
    it("resolves the promise with a generator that yields the objects", done => {
      exporter
        .load(testDbFile)
        .then(exporter.select("Cartoon"))
        .then(generator => {
          expect([...generator]).to.eql([
            {
              id: 1,
              name: "Fred Flinstone",
              age: 30
            },
            {
              id: 2,
              name: "Johnny Bravo",
              age: 22
            }
          ]);
  
          done();
        })
        .catch(done);
    });
  
    it("uses the custom mapper when one is provided", done => {
      exporter
        .load(testDbFile)
        .then(exporter.select("Cartoon", (obj, _) => obj['name']))
        .then(generator => {
          expect([...generator]).to.eql(["Fred Flinstone", "Johnny Bravo"]);
          done();
        })
        .catch(done);
    });
  
    context("when the object type doesn't exist on the database", () => {
      it("rejects the promise with an error", done => {
        exporter
          .load(testDbFile)
          .then(exporter.select("nonExistentObject"))
          .then(done, error => {
            expect(error).to.be.instanceOf(Error);
            done();
          });
      });
    });
  });
  
  describe(".csvFormatter", () => {
    it("returns a promise which resolves to a generator that yields the CSV lines", done => {
      exporter
        .load(testDbFile)
        .then(exporter.select("Cartoon"))
        .then(csvFormatter)
        .then(csvGenerator => {
          const csvLines = [...csvGenerator]
          
          expect(csvLines).to.eql([
            '"1","Fred Flinstone","30"',
            '"2","Johnny Bravo","22"'
          ]);

          done();
        })
        .catch(done);
    });
  });

describe('.getObjectNames', () => {
  it('retrieves all the object names of the database schema', (done) => {
    exporter
        .load(testDbFile)
        .then(exporter.getObjectNames)
        .then((names) => {
          expect(names).to.eql(["Cartoon", "a"]);
          done();
        })
        .catch(done);
  })
})