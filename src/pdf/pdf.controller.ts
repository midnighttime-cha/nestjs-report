import { Controller, Get, Injectable, Res, Req, HttpStatus, HttpException, Param, Header } from '@nestjs/common';
import { PdfService } from './pdf.service';
const fs = require('fs');
const pdf = require('html-pdf');
const hb = require('handlebars');
const path = require('path');

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly mainServices: PdfService
  ) { }

  @Get('generate/:filename')
  async generatePdf(@Res() res, @Req() req, @Param() param) {
    try {
      const data = await this.mainServices.generatePdf(param.filename);
      return await res.sendFile(data.files, { root: data.path });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
