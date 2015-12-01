# marionette-base 

## Description

The aim of this project is to give a base for web application using Marionette. It includes all its dependencies (Backbone, Underscore, jQuery) and a lot of others useful components.

## List of components

[backbone.marionette](http://marionettejs.com/) : Marionette framework

[backbone.radio](https://github.com/marionettejs/backbone.radio) : Messaging patterns for Backbone applications

[backbone](http://backbonejs.org/) : Backbone library

[underscore](http://underscorejs.org/) : Underscore library

[jQuery](https://jquery.com/) : jQuery library for DOM Manipulation and ajax

[require](http://requirejs.org/) : Javascript file and module loader (AMD)

[handlebars](http://handlebarsjs.com/) : Template engine for processing views

[bootstrap](http://getbootstrap.com/) : Responsive HTML, CSS framework

## Installation

To install all dependencies, you first need to install node.js that you can download there :  [download node.js](https://nodejs.org/en/download/)

After installation, add node.js root installation folder in your PATH env variable

Then npm (node package manager) should be available on command line so you can install bower and grunt-ci globally :

`npm install bower grunt-cli -g`

Once bower installed, go to project root folder (Marionnette_Base) and run command : 

`bower install`

In order to compile handlebars templates, a grunt task (that uses a grunt plugin) has been set into Gruntfile.js. To run task,

you have to first install both grunt and grunt-contrib-handlebars that are defined into package.json as dev dependencies. 

So just run :

`npm install`

You can then compile your handlebars templates by running the command in root folder (Marionnette_Base) :

`grunt handlebars:compile`

Template will be precompiled and available in file public/scripts/tpls/precompiled.handlebars.js



