import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { SlackTeamService } from '../services/slack.team.service';
import * as fs from 'fs';

export const FILE_NAME_ACCESS_LOGS = 'accessLogs.csv';
const FILE_NAME_ACCESS_LOGS_BY_USER_ID = 'accessLogsByUserId.csv';

@Controller('api/slack/teams')
@ApiTags('api/slack/teams')
export class SlackTeamController {
  constructor(private readonly slackTeamService: SlackTeamService) {}

  @Get('/accessLogs')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get access logs of Slack teams',
  })
  async getAccessLogs(
    @Headers() headers,
    @Query() queryParams,
    @Response() response,
  ) {
    const authHeader = headers.authorization;
    const fileStream = fs.createWriteStream(FILE_NAME_ACCESS_LOGS);
    const stream = new Readable();
    let maxPage = 0;
    if (queryParams && 'maxPage' in queryParams) {
      maxPage = queryParams.maxPage;
    }

    stream._read = () => {};
    // Send the data as a file stream
    response.setHeader('Content-Type', 'application/octet-stream');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${FILE_NAME_ACCESS_LOGS}"`,
    );
    stream.pipe(response);
    stream.pipe(fileStream);
    await this.slackTeamService.getAccessLogs(authHeader, maxPage, stream);
    // fileStream.close();
  }

  @Post('/accessLogsByUserId')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get access logs of Slack teams by User Ids',
  })
  async getAccessLogsByUserId(
    @Body() body,
    @Headers() headers,
    @UploadedFile() file,
    @Response() response,
  ) {
    const authHeader = headers.authorization;
    const stream = new Readable();
    const fileStream = fs.createWriteStream(FILE_NAME_ACCESS_LOGS_BY_USER_ID);
    const maxPage = 0 < body.maxPage ? body.maxPage : 0;
    const userIds = file.buffer
      .toString('utf-8')
      .split(/\r?\n|,/)
      .map((uid: string) => uid.trim());
    stream._read = () => {};
    // Send the data as a file stream
    response.setHeader('Content-Type', 'application/octet-stream');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${FILE_NAME_ACCESS_LOGS_BY_USER_ID}"`,
    );
    stream.pipe(response);
    stream.pipe(fileStream);
    await this.slackTeamService.getAccessLogsByUserId(
      authHeader,
      userIds,
      maxPage,
      stream,
    );
    // fileStream.close();
  }
}
