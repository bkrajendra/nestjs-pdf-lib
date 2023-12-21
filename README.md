# NestJS PDF Library

NestJS PDF Library to generate PDF with the help of handlebar template using HTML.

> There are multiple libraries out there, but it lacks the support for running inside docker container. This is an effort to make this library to be able to run the containers.

## Installation

`npm i @bkrajendra/nestjs-pdf-lib`

## How to use?

Initialization

```typescript
// pdf.service.ts
import { Injectable } from '@nestjs/common';
import { createPdf } from '@bkrajendra/nestjs-pdf-lib';
import * as path from 'path';

@Injectable()
export class PdfService {
  constructor(private admService: NurseryAdmissionService) {}
  generatePDF(id: number) {
    const data = {
      title: 'Handlebars Example',
      items: ['Item 1', 'Item 2', 'Item 3'],
      showFooter: true,
    };

    const options = {
      format: 'A4',
      displayHeaderFooter: true,
      margin: {
        left: '10mm',
        top: '25mm',
        right: '10mm',
        bottom: '15mm',
      },
      footerTemplate:
        '<div style="width: 100%; text-align: center; font-size: 10px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
      landscape: false,
    };
    const filePath = path.join(
      process.cwd(),
      'src/domain/pdf/templates',
      'admission.hbs'
    );
    return createPdf(filePath, options, data);
  }
}
```

Handlebar Template:

```html
<!-- templates/mypdf.hdb -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Handlebars Example</title>
  </head>
  <body>
    <h1>{{title}}</h1>

    <ul>
      {{#each items}}
      <li>{{this}}</li>
      {{/each}}
    </ul>

    <p>{{#if showFooter}}This is the footer.{{/if}}</p>
  </body>
</html>
```

Controller

```typescript
// pdf.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private pedService: PdfService,
  ) {}
  @Get(':id')
  async generatePdf2(@Res() res, @Param('id') id: number) {
    const buffer = await this.pedService.generatePDF(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${id}.pdf`,
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });
    res.end(buffer);
  }
}

```

## Commands

To run build the library, use:

```bash
npm run buid # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

#### Setup Files

This is the folder structure we set up for you:

```txt
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.
