import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';

import { User, UserSchema } from '../user/entities/user.entity';
import { Formula, FormulaSchema } from './entities/formula.entity';
import { FormulaController } from './formula.controller';
import { FormulaService } from './formula.service';

@Module({
  controllers: [FormulaController],
  providers: [FormulaService],
  imports: [
    MongooseModule.forFeature([{ name: Formula.name, schema: FormulaSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class FormulaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('formulas');
  }
}
