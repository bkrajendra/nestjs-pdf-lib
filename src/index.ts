import * as hbs from 'handlebars';
import puppeteer from 'puppeteer';
// import puppeteer from 'puppeteer-core';
import * as fs from 'fs';
// import * as path from 'path';

export const generatePDF = async (
  filePath: string,
  options = {},
  data = {},
  puppeteer_options?: any
) => {
  let launch_options = puppeteer_options
    ? puppeteer_options
    : {
        headless: 'new',
        executablePath:
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--no-zygote'], // Parameters are needed to run properly in docker container.
      };
  try {
    const browser = await puppeteer.launch(launch_options);
    const page = await browser.newPage();

    const html = await fs.readFile(filePath, { encoding: 'utf8' }, () => {
      // console.log(e);
    });
    const content = hbs.compile(html)(data);
    await page.setContent(content);

    const buffer = await page.pdf({
      // path: 'admission.pdf',
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
