import { Test, TestingModule } from '@nestjs/testing';
import { FILE_NAME_ACCESS_LOGS, SlackTeamController } from './slack.team.controller';
import { SlackTeamService } from '../services/slack.team.service';
import { Readable } from 'stream';
import { HttpStatus } from '@nestjs/common';

describe('SlackTeamController', () => {
  let slackTeamController: SlackTeamController;
  let slackTeamService: SlackTeamService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SlackTeamController],
      providers: [SlackTeamService],
    }).compile();

    slackTeamController = app.get<SlackTeamController>(SlackTeamController);
    slackTeamService = app.get<SlackTeamService>(SlackTeamService);
  });

  describe('getAccessLogs', () => {
    it('should get access logs and set response heades', async () => {
      // Mocking dependencies and setting up test data
      const authHeader = "Bearer token xxx";
      const maxPage = 1;
      const response = {
        setHeader: jest.fn(),
        // status: jest.fn(),
      };
      const stream = new Readable();
      const mockServiceResponse = "Mocked access logs";
      jest.spyOn(slackTeamService, "getAccessLogs").mockImplementation(async (authHeader, maxPage, stream) => {
        stream.push(mockServiceResponse);
        stream.push(null);
        return stream;
      });

      await slackTeamController.getAccessLogs({authorization: authHeader}, {maxPage}, response);

      expect(response.setHeader).toHaveBeenCalledWith('Content-type', 'application/octet-stream');
      expect(response.setHeader).toHaveBeenCalledWith('Content-Disposition', `attachment; filename="${FILE_NAME_ACCESS_LOGS}"`);
      // expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);

      let data = '';
      stream.on('data', (chunk) => {
        data += chunk;
      });

      await new Promise((resolve) => stream.on('end', resolve));
      expect(data).toBe(mockServiceResponse);
    });
  });
});
