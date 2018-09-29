[![Build Status](https://travis-ci.org/diogoosorio/realm-exporter.svg?branch=master)](https://travis-ci.org/diogoosorio/realm-exporter)
[![npm version](https://badge.fury.io/js/realm-exporter.svg)](https://badge.fury.io/js/realm-exporter)

# Realm Exporter

A command line tool to quickly export your [Realm](http://realm.io/) database into a more "user-friendly" format.


## Disclaimer

This tool (and myself) has no assocation with [Realm](http://realm.io/) (the company), the project wasn't developed nor
is maintained by their team - this was a personal weekend project of mine, brought to existence by my personal necessity.


## Installation

You need to install [NodeJS](https://nodejs.org/en/). Realm javascript SDK [doesn't support node 10](https://github.com/realm/realm-js/issues/1813)
yet, so you'll need to have an older version installed.

You can give a look at [nvm](https://github.com/creationix/nvm) if you have node 10 installed in your system.

After you have node installed, simply install the `npm` package:

```sh
$ npm install -g realm-exporter
```

If the installation was successful, you should be able to use the `realm-exporter` command:

```sh
$ realm-exporter --help
```


## Usage

### Commands

```sh
$ realm-exporter objects    # list all objects available on a .realm database file
$ realm-exporter export     # export all records of an object type
```

### Basic usage

Let's retrieve all the available objects on our `.realm` database, using the **objects** command:

```sh
$ realm-exporter objects db.realm
Cartoon
Location
```

And dump all the `Cartoon` objects on the database into a CSV file, using the **export** command:

```sh
$ realm-exporter export db.realm Cartoons > cartoons.csv
$ cat cartoons.csv
"1","Fred Flinstone","30"
"2","Johnny Bravo","22"
```
