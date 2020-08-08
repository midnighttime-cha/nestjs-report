import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
const fs = require('fs');
const path = require('path');
const utils = require('util');
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const readFile = utils.promisify(fs.readFile);

@Injectable()
export class PdfService {
  async getTemplateHtml(filename: string) {
    Logger.log(`Loading template file in memory : ${filename}`);
    try {
      const filePath = path.resolve(`./views/${filename}.hbs`);
      return await readFile(filePath, 'utf8');
    } catch (error) {
      throw new HttpException(`Could not load html template: ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async generatePdf(filename: string) {
    let data = { message: filename };
    const files = await `./files/pdf/${filename}.pdf`;
    await this.getTemplateHtml(filename).then(async (res) => {
      Logger.log("Compiing the template with handlebars")
      const template = hb.compile(res, { strict: true });
      const result = template(data);
      const html = result;
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(html);
      await page.pdf({ path: files, format: 'A4' });
      await browser.close();

      await Logger.log("PDF Generated");
    }).catch(error => {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    });
    return { files: `${filename}.pdf`, path: `./files/pdf/` };
  }

  async generateExecl(filename: string) {
    let data = { message: '111' };
    let page: any;
    await this.getTemplateHtml(filename).then(async (res) => {
      Logger.log("Compiing the template with handlebars")
      const template = hb.compile(res, { strict: true });
      const result = template(data);
      const html = result;
      const browser = await puppeteer.launch();
      page = await browser.newPage();

      await page.setContent(html);
      await page.pdf({ path: `./files/excel/${filename}.pdf`, format: 'A4' });
      await browser.close();
      Logger.log("PDF Generated")
    }).catch(error => {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    });
    return await page;
  }
}
