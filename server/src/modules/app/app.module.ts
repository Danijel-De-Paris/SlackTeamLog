import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { SlackTeamModule } from '../slack/team/slack.team.module';

@Module({
  imports: [SlackTeamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
