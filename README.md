[![Build Status](https://travis-ci.org/diogoosorio/realm-exporter.svg?branch=master)](https://travis-ci.org/diogoosorio/realm-exporter)

# Realm Exporter

Provides a CLI tool and API to quickly export a [Realm](http://realm.io/) database file into a CSV format.


## Usage

To use the CLI tool, declare the project as a global dependency:

```sh
$ npm install -g realm-exporter
$ realm-exporter mydb.realm SomeObject
```