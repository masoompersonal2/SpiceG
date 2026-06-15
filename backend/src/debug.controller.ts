import { Controller, Get, Delete } from '@nestjs/common';
import { crashLogs } from './main';

@Controller('api/debug')
export class DebugController {
  @Get('logs')
  getLogs() {
    return { logs: crashLogs };
  }

  @Delete('logs')
  clearLogs() {
    crashLogs.length = 0;
    return { success: true };
  }
}
