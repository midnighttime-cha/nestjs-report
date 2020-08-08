import { Controller, Get, Injectable, Res, Req, HttpStatus, HttpException } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly mainServices: PdfService
  ) { }

  @Get('generate')
  async generatePdf(@Res() res, @Req() req) {
    try {
      const data = await this.mainServices.generatePdf();
      return await res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
