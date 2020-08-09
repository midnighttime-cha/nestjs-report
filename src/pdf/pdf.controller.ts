import { Controller, Get, Res, Req, HttpStatus, HttpException, Param, Header } from '@nestjs/common';
import { PdfService } from './pdf.service';

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
