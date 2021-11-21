# How To Contribute

## Installation

* `git clone https://github.com/sandydoo/ember-google-maps`
* `cd ember-google-maps`
* `yarn install`

## Linting

* `yarn lint`
* `yarn lint:fix`

#### Setting up API keys

The dummy app and test suite is run using a live map instance, which means you need an API key. I do not provide API keys for testing – you need to generate your own.

You can create an API key by following the instructions here: [Create API key](https://developers.google.com/maps/documentation/javascript/get-api-key).

Assign this key to the `GOOGLE_MAPS_API_KEY` variable in `.env` or just run these lines, making sure to replace `INSERT_YOUR_KEY_HERE` with your actual key.

`touch .env && echo 'GOOGLE_MAPS_API_KEY=<INSERT_YOUR_KEY_HERE>' > .env`
`cp .env .env.test`

## Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

## Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).


## Debugging the build process

This addon modifies the components included in the final build. You can store incremental build trees to debug the build process with the following command.

* `rm -rf DEBUG; BROCCOLI_DEBUG=ember-google-maps:* ember s`

This will create a `DEBUG` folder at the root of the project containing the source files at various stages of processing.
The `with-addon-factory` and `post-filter` trees should likely be investigated first.

