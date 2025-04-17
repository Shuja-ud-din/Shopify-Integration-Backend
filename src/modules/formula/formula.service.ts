import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateFormulaDto } from './dtos/create-formula.dto';
import { Formula, IFormulaDoc } from './entities/formula.entity';

@Injectable()
export class FormulaService {
  constructor(
    @InjectModel(Formula.name)
    private formulaModel: Model<IFormulaDoc>,
  ) {}

  async getAllFormulas(store: string): Promise<IFormulaDoc[]> {
    return this.formulaModel.find({ store });
  }

  async getFormulaById(store: string, id: string): Promise<IFormulaDoc> {
    return this.formulaModel.findOne({ _id: id, store });
  }

  async createFormula(
    store: string,
    payload: CreateFormulaDto,
  ): Promise<IFormulaDoc> {
    const newFormula = new this.formulaModel({
      ...payload,
      store,
    });

    return newFormula.save();
  }

  async updateFormula(
    store: string,
    id: string,
    payload: CreateFormulaDto,
  ): Promise<IFormulaDoc> {
    const formula = await this.formulaModel.findOne({ _id: id, store });
    if (!formula) {
      throw new Error('Formula not found');
    }

    formula.name = payload.name;
    formula.description = payload.description;
    formula.formula = payload.formula;
    formula.updatedAt = new Date();
    return formula.save();
  }

  async deleteFormula(store: string, id: string): Promise<boolean> {
    const formula = await this.formulaModel.findOne({ _id: id, store });
    if (!formula) {
      throw new Error('Formula not found');
    }

    await formula.deleteOne();

    return true;
  }
}
