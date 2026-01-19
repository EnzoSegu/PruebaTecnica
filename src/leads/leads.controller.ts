import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('/create-lead') // Según PDF: POST /create-lead
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get() // Según PDF: GET /leads
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id') // Según PDF: GET /leads/:id
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(+id);
  }
}
