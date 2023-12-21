import * as c from "../src";

import * as path from 'path';

describe('blah', () => {

  test('works', async() => {
    const data = {
      title: "NestJS PDF Library to generate PDF with the help of handlebar template using HTML.",
      items: ["Item 1", "Item 2", "Item 3"],
      showFooter: true
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
      headerTemplate: `Header`,
      footerTemplate:
        'Copyright 2024',
      landscape: false,
    };
    const filePath = path.join(process.cwd(), 'templates', 'mypdf.hbs');
    const buffer = await c.generatePDF(filePath, options, data, null, 'my.pdf');
    expect(typeof buffer).toEqual('object');
  });

  afterAll(done => {
    done();
});
});
