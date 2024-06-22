import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PersonInput } from "./person.entity";
import { PersonService } from "./person.service";
import { Person } from "./person.schema";

@Controller('person')
export class PersonController {
  private readonly personService: PersonService;

  constructor(personService: PersonService) {
    this.personService = personService;
  }

  @Post()
  async savePerson(@Body() person: PersonInput): Promise<Person> {
    return await this.personService.createNewPersonEntity(person);
  }

  @Get()
  async getAllPersons(): Promise<Person[]> {
    return await this.personService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Person> {
    return await this.personService.findOne(id);
  }
}