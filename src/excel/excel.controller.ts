import { Controller, Get, Res, Param, HttpException, HttpStatus, Header, Head } from '@nestjs/common';
import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(
    private readonly mainServices: ExcelService
  ) { }

  @Get('generate/:filename')
  @Header('Content-Type', 'application/vnd.ms-excel; charset=UTF-8; name=excel')
  @Header('Content-Disposition', `attachment; filename=test.xls`)
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async generatePdf(@Res() res, @Param() param) {
    try {
      const data = await this.mainServices.getTemplateHtml(param.filename);
      console.log(data);
      return await res.sendFile(data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
