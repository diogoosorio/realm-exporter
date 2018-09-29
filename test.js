const expect = require("chai").expect;
const exporter = require(".");
const Realm = require("realm");

const testDbFile = "./tests-db.realm";

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
        expect([...generator()]).to.eql([
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

  context("when the object type doesn't exist on the database", () => {
    it("rejects the promise with an InvalidObjectTypeError", done => {
      exporter
        .load(testDbFile)
        .then(exporter.select("nonExistentObject"))
        .then(done, error => {
          expect(error).to.be.instanceOf(
            exporter.errors.InvalidObjectTypeError
          );
          done();
        });
    });
  });
});

describe("CSV translator", () => {
  it("resolves the promise with the translated data", done => {
    exporter
      .load(testDbFile)
      .then(exporter.select("Cartoon"))
      .then(exporter.translators.CSV)
      .then(csvGenerator => {
        expect([...csvGenerator()]).to.eql([
          '"1","Fred Flinstone","30"',
          '"2","Johnny Bravo","22"'
        ]);
        done();
      })
      .catch(done);
  });
});
