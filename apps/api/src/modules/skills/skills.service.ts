import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Skill } from '../../entities/skill.entity.js'

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.skillRepo.find({ where: { active: true } })
  }

  async findOne(id: string): Promise<Skill | null> {
    return this.skillRepo.findOne({ where: { id } })
  }

  async upsert(data: Partial<Skill>): Promise<Skill> {
    return this.skillRepo.save(this.skillRepo.create(data))
  }
}
