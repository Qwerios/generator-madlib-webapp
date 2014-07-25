# generator-madlib-webapp
[![Build Status](https://travis-ci.org/Qwerios/generator-madlib-webapp.svg?branch=master)](https://travis-ci.org/Qwerios/generator-madlib-webapp)  [![NPM version](https://badge.fury.io/js/generator-madlib-webapp.png)](http://badge.fury.io/js/generator-madlib-webapp)

[![Npm Downloads](https://nodei.co/npm/generator-madlib-webapp.png?downloads=true&stars=true)](https://nodei.co/npm/generator-madlib-webapp.png?downloads=true&stars=true)

A [Yeoman](http://yeoman.io) based generator for madlib based webapps.

This generator uses browserify to bundle the web application. I used CoffeeScript for my index but using CoffeeScript is in no way mandatory.

## Getting Started
First make sure yo and and the generator are installed:
```bash
$ npm install -g yo generator-madlib-webapp
```

You may need to have sudo permissions to install globally.
After that you can create a new madlib module by creating a folder and then using the following command:
```bash
$ mkdir madlib-my-webapp
$ cd madlib-my-webapp
$ yo madlib-webapp
```

Yeoman will appear and ask you a few questions. Once they have been answered he will generate the required files to get started.

Grunt is used to build the project. A special grunt task exists called 'dev' that can be used to start watching your development files.
It will pick up both Sass and source file changes. The watch option for browserify (watchify) is used to rebuild your bundle as quickly as possible.

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-madlib-webapp from npm, run:

```
$ npm install -g generator-madlib-webapp
```

Finally, initiate the generator:

```
$ yo madlib-webapp
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

[BSD License](http://en.wikipedia.org/wiki/BSD_License)
