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

  it("uses the custom mapper when one is provided", done => {
    exporter
      .load(testDbFile)
      .then(exporter.select("Cartoon", (_, obj) => obj.name))
      .then(generator => {
        expect([...generator()]).to.eql(["Fred Flinstone", "Johnny Bravo"]);
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

describe("csv formatter", () => {
  it("returns a promise which resolves to a generator that yields the CSV lines", done => {
    exporter
      .load(testDbFile)
      .then(exporter.select("Cartoon"))
      .then(exporter.format.csv)
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
