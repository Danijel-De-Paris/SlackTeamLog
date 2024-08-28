import { Module } from '@nestjs/common';
import { SlackTeamController } from './controllers/slack.team.controller';
import { SlackTeamService } from './services/slack.team.service';

@Module({
    imports: [],
    controllers: [SlackTeamController],
    providers: [SlackTeamService],
})
export class SlackTeamModule { }
