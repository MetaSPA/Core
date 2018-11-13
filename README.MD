# Meta Single Page Application (WIP)

This is a POC for micro frontend. The MetaSPA Core uses a predefined webpack JSONP format to import modules (RUN TIME IMPORT!) from different independent webpack builds.

In the example, we are using preact/react-router in master SPA (we are using preact for better bundle size). The master SPA will nestedly route a react component and vue component.

## POC Example Usage

-   Install core dependencies

```bash
#From project root
cd ./core
npm install
```

-   Install example dependencies

```bash
#From project root
cd ./test
npm install
```

-   To avoid type conflict of react and preact (@types/react will be automatically installed due to some other modules), delete the @types/react

```bash
#From project root
cd ./test
rm -rf node_modules/@types/react
```

-   Start static server at port 8081, and start master SPA at 3200, then play at http://localhost:3200

```bash
#From project root
cd ./test
npm run serve:static
npm run serve
```
