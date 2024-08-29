import {
  BadRequestException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { Readable } from 'stream';
import axios, { AxiosResponse } from 'axios';
import { json2csv } from '../../../../utils/json2csv';
import { TeamAccessLog } from '../../../../types/slack/team/accessLog';

const LIMIT_PER_CURSOR = 500;

@Injectable()
export class SlackTeamService {
  async getAccessLogs(
    authHeader: string,
    maxPage: number,
    stream: Readable,
  ): Promise<Readable> {
    const url = 'https://slack.com/api/team.accessLogs';
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    };
    let response: AxiosResponse<any> | undefined;
    let next_cursor = undefined;
    let csv_headers = [];
    let total_count = 0;
    let page = 0;

    while (true) {
      try {
        response = await axios.get(url, {
          headers,
          params: {
            limit: LIMIT_PER_CURSOR,
            cursor: next_cursor,
          },
        });
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }

      let respData = response.data;
      if (false === respData.ok) {
        throw new BadRequestException(respData.error);
      }

      if (0 === csv_headers.length && 0 < respData.logins.length) {
        // Initialize CSV headers
        csv_headers = Object.keys(respData.logins[0]);
        stream.push(csv_headers.join(',')); // header row first
        stream.push('\r\n');
      }
      stream.push(json2csv(respData.logins, csv_headers));
      stream.push('\r\n');
      total_count += respData.logins.length;
      console.log(`Scraped ${total_count} logins in ${page} pages`);
      page++;
      next_cursor = respData.response_metadata.next_cursor;
      if (!next_cursor) {
        break;
      }
      if (0 < maxPage && page > maxPage) {
        break;
      }
    }
    stream.push(null);
    return stream;
  }

  async getAccessLogsByUserId(
    authHeader: string,
    userIds: Array<string>,
    maxPage: number,
    stream: Readable,
  ): Promise<Readable> {
    const url = 'https://slack.com/api/team.accessLogs';
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    };
    let response: AxiosResponse<any> | undefined;
    let next_cursor = undefined;
    let csv_headers = [];
    let total_count = 0;
    let page = 0;
    const userIdMap = new Map();

    for (const userId of userIds) {
      userIdMap.set(userId, false);
    }
    const targetUserIdNumber = userIdMap.size;
    console.log(`Input ${targetUserIdNumber} user IDs`);

    let retrievedUserCount = 0;

    while (true) {
      try {
        response = await axios.get(url, {
          headers,
          params: {
            limit: LIMIT_PER_CURSOR,
            cursor: next_cursor,
          },
        });
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }

      let respData = response.data;
      if (false === respData.ok) {
        throw new BadRequestException(respData.error);
      }

      if (0 === csv_headers.length && 0 < respData.logins.length) {
        // Initialize CSV headers
        csv_headers = Object.keys(respData.logins[0]);
        stream.push(csv_headers.join(',')); // header row first
        stream.push('\r\n');
      }

      const filtered_logins = [];
      for (let i = 0; i < respData.logins.length; i++) {
        const accessLog: TeamAccessLog = respData.logins[i];
        const user_id = accessLog.user_id;
        if (!userIdMap.has(user_id)) {
          continue;
        }
        if (userIdMap.get(user_id) === true) {
          continue;
        }
        filtered_logins.push(accessLog);
        userIdMap.set(user_id, true);
        retrievedUserCount += 1;
        if (retrievedUserCount >= targetUserIdNumber) {
          break;
        }
      }
      stream.push(json2csv(filtered_logins, csv_headers));
      stream.push('\r\n');
      total_count += respData.logins.length;
      page++;
      console.log(
        `Scraped ${total_count} logs, Get ${retrievedUserCount} logs in ${page} pages.`,
      );
      if (retrievedUserCount >= targetUserIdNumber) {
        break;
      }

      if (0 < maxPage && page > maxPage) {
        break;
      }

      next_cursor = respData.response_metadata.next_cursor;
      if (!next_cursor) {
        break;
      }
    }
    stream.push(null);
    return stream;
  }
}
