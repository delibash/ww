## Base tools

(Full list of dev dependencies in package.json):

- [Webpack](https://webpack.github.io/) - Module Bundler
- [React](https://facebook.github.io/react/) - Library for modular interfaces
- [Babel](https://babeljs.io/) - JavaScript Compiler
- [PostCSS](https://github.com/postcss) - CSS Processor (and PostCSS plugins)
- [React CSS Modules](https://github.com/gajus/react-css-modules) - For reusable no conflict module composition
- [LostGrid](http://lostgrid.org/) - Grid built on PostCSS with easy responsive breakpoints
- [StoryBook](https://github.com/storybooks/storybook) - Interactive development & testing environment for React and React-Native UI components

## Install

```
$ git clone [repo] && cd [repo]
$ npm i
```

## Running

Dev mode:
```
$ npm start
```
Staging mode:
```
$ npm run staging
```
Prod mode:
```
$ npm run prod
```
## Building
Prod
```
$ npm build
```
Staging
```
$ npm build:staging
```
Dev
```
$ npm build:development
```

Will run at [http://localhost:8080](http://localhost:8080/)

## Test
```
$ npm test
```

## StoryBook

Install globally

```
$ npm install -g getstorybook
```

Run StoryBook

```
$ npm run storybook
```
