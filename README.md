# Realm Exporter

Provides a CLI tool and API to quickly export a [Realm](http://realm.io/) database file into a CSV format.


## Usage

To use the CLI tool, declare the project as a global dependency:

```sh
npm install -g realm-exporter
```

The `realm-exporter` command should be present in your `$PATH`. The command has the following arguments:

```sh
realm-exporter <db-file> <db-object>

    * <dbfile>      - the .realm database file you want to extract the data from
    * <db-object>   - the object within the database you want to dump
```

An example would be:

```sh
realm-exporter ~/Downloads/imovirtual/assets/locations_db.realm LocationObject
```