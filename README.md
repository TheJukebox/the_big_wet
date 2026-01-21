# The Big Wet

The Big Wet game system for FoundryVTT.

## Contributing

This project uses [yarn for package management](https://yarnpkg.com/).

### Quickstart

```sh
yarn install
yarn build
```

### Building

This project is developed in Typescript for a lot of very sensible reasons. Unfortunately,
FoundryVTT does not natively support Typescript for systems or modules, so we have to compile
to plain Javascript.

To do this, we have a very simple Vite config that transpiles our code:

```sh
yarn build
```

The resulting output is placed in a `dist` directory, which the `system.json` points to.
