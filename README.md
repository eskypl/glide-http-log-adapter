
# <a href="https://github.com/eskypl/glide"><img src="https://raw.github.com/eskypl/glide/master/assets/glide-logo.png" alt="Glide" width="84"></a> HttpLogAdapter

JavaScript logger that logs a message to an external service via ajax http request.
The request has JSON format and is ready to handle cross-domain requests.

## Instalation

`npm install glide-http-log-adapter --save`

## Configuration

Minimal configuration for RequireJS is needed. RequireJS `paths` config variable
has to include property `http-log-adapter` with given path to script.

### Development and Build

Following code should be used in development and build.

```js
require.config({
  paths: {
    'http-log-adapter': 'node_modules/glide-http-log-adapter/adapter'
  }
});
```

## Usage

```js
define([
  'http-log-adapter'
], function (httpLogAdapter) {
	httpLogAdapter.setUrl('/logService');
	httpLogAdapter.log('abc');
});
```