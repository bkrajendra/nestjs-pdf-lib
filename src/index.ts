import * as hbs from 'handlebars';
// import puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-core';
const fs = require('fs-extra');
// import * as path from 'path';

export const generatePDF = async (
  filePath: string,
  options = {},
  data = {},
  puppeteer_options?: any,
  outputPath?: string
) => {
  let launch_options = puppeteer_options || {
    headless: 'new',
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--no-zygote'], // Parameters are needed to run properly in docker container.
  };
  try {
    const browser = await puppeteer.launch(launch_options);
    const page = await browser.newPage();

    hbs.registerHelper('ifCond', function(
      v1: any,
      operator: any,
      v2: any,
      options: any
    ) {
      switch (operator) {
        case '==':
          return v1 == v2 ? options.fn(data) : options.inverse(data);
        case '===':
          return v1 === v2 ? options.fn(data) : options.inverse(data);
        case '!=':
          return v1 != v2 ? options.fn(data) : options.inverse(data);
        case '!==':
          return v1 !== v2 ? options.fn(data) : options.inverse(data);
        case '<':
          return v1 < v2 ? options.fn(data) : options.inverse(data);
        case '<=':
          return v1 <= v2 ? options.fn(data) : options.inverse(data);
        case '>':
          return v1 > v2 ? options.fn(data) : options.inverse(data);
        case '>=':
          return v1 >= v2 ? options.fn(data) : options.inverse(data);
        case '&&':
          return v1 && v2 ? options.fn(data) : options.inverse(data);
        case '||':
          return v1 || v2 ? options.fn(data) : options.inverse(data);
        default:
          return options.inverse(options);
      }
    });

    hbs.registerHelper({
      eq: (v1: any, v2: any) => v1 === v2,
      ne: (v1: any, v2: any) => v1 !== v2,
      lt: (v1: number, v2: number) => v1 < v2,
      gt: (v1: number, v2: number) => v1 > v2,
      lte: (v1: number, v2: number) => v1 <= v2,
      gte: (v1: number, v2: number) => v1 >= v2,
      and() {
        return Array.prototype.every.call(arguments, Boolean);
      },
      or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
      },
    });

    const html = await fs.readFile(filePath, 'utf8');
    const content = hbs.compile(html)(data);
    await page.setContent(content);

    const buffer = await page.pdf({
      path: outputPath,
      format: 'a4',
      printBackground: true,
      margin: {
        left: '10mm',
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
      },
      ...options,
    });
    await browser.close();
    // process.exit();
    return buffer;
  } catch (e) {
    console.log(e);
    return e;
  }
};

// const data = {
//   admission: {student_lname: 'Doe', student_fname: 'John', student_mname: 'Smith'},
// }
// const options = {
//   format: 'A4',
//   displayHeaderFooter: true,
//   margin: {
//     left: '10mm',
//     top: '25mm',
//     right: '10mm',
//     bottom: '15mm',
//   },
//   headerTemplate: `Header`,
//   footerTemplate:
//     'Copyright 2024',
//   landscape: false,
// };
// const filePath = path.join(process.cwd(), 'templates', 'admission-form.hbs');
// const buffer = create(filePath, options, data);
