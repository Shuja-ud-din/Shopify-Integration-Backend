import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StoreGuard } from 'src/common/guards/store.guard';

import { CreateFormulaDto } from './dtos/create-formula.dto';
import { FormulaService } from './formula.service';
import { CreateFormulaInterceptor } from './interceptors/createFormulas.interceptor';
import { DeleteFormulaInterceptor } from './interceptors/deleteFormulas.interceptor';
import { GetFormulaInterceptor } from './interceptors/getFormula.interceptor';
import { GetFormulasInterceptor } from './interceptors/getFormulas.interceptor';
import { UpdateFormulaInterceptor } from './interceptors/updateFormulas.interceptor';

@Controller('formula')
export class FormulaController {
  constructor(private readonly formulaService: FormulaService) {}

  @UseInterceptors(GetFormulasInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(StoreGuard)
  async getAllFormulas(@Query('store') storeId: string) {
    return this.formulaService.getAllFormulas(storeId);
  }

  @UseInterceptors(GetFormulaInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @UseGuards(StoreGuard)
  async getAllFormula(
    @Query('store') storeId: string,
    @Param('id') id: string,
  ) {
    return this.formulaService.getFormulaById(storeId, id);
  }

  @UseInterceptors(CreateFormulaInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(StoreGuard)
  async createFormula(
    @Query('store') storeId: string,
    @Body() payload: CreateFormulaDto,
  ) {
    return this.formulaService.createFormula(storeId, payload);
  }

  @UseInterceptors(UpdateFormulaInterceptor)
  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @UseGuards(StoreGuard)
  async updateFormula(
    @Query('store') storeId: string,
    @Param('id') id: string,
    @Body() payload: CreateFormulaDto,
  ) {
    return this.formulaService.updateFormula(storeId, id, payload);
  }

  @UseInterceptors(DeleteFormulaInterceptor)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @UseGuards(StoreGuard)
  async deleteFormula(
    @Query('store') storeId: string,
    @Param('id') id: string,
  ) {
    return this.formulaService.deleteFormula(storeId, id);
  }
}
