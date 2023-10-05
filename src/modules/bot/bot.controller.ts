// import { Controller, Post, Req, Res } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { InjectBot } from 'nestjs-telegraf';
// import { Telegraf } from 'telegraf';
//
// @Controller('bot')
// export class BotController {
//   constructor(@InjectBot() private bot: Telegraf) {}
//
//   @Post('update')
//   async handleUpdate(@Req() req: Request, @Res() res: Response) {
//     await this.bot.handleUpdate(req.body, res);
//   }
// }
