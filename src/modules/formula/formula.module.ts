import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';

import { Formula, FormulaSchema } from './entities/formula.entity';
import { FormulaController } from './formula.controller';
import { FormulaService } from './formula.service';

@Module({
  controllers: [FormulaController],
  providers: [FormulaService],
  imports: [
    MongooseModule.forFeature([{ name: Formula.name, schema: FormulaSchema }]),
  ],
})
export class FormulaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('formula');
  }
}
