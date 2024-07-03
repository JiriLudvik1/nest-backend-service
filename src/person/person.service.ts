import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePersonDto } from "./person.entity";
import { Person, PersonDocument } from "./person.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { isPersonEntityValid } from "./person.validator";
import { SessionsService } from "../session/sessions.service";
import { UpsertSessionDto } from "../session/models/upsert-session.dto";

@Injectable()
export class PersonService {
  constructor(@InjectModel(Person.name) private personDocumentModel: Model<PersonDocument>,
              private sessionService: SessionsService) {
  }

  async createNewPersonEntity(personDto: CreatePersonDto): Promise<Person> {
    const newPersonModel: Person = {
      firstName: personDto.name.first,
      lastName: personDto.name.last,
      rating: personDto.rating,
      ratedAt: new Date(personDto.ratedAt)
    };

    if (!isPersonEntityValid(newPersonModel)) {
      throw new BadRequestException(`Person not valid: ${newPersonModel}`);
    }

    const createdPerson = new this.personDocumentModel(newPersonModel);
    const savedPerson = await createdPerson.save();

    const upsertSessionDto: UpsertSessionDto = {
      ratedUsers: [savedPerson.id],
      browserId: personDto.browserId
    };

    await this.sessionService.upsertSession(upsertSessionDto);
    return savedPerson;
  }

  async findAll(): Promise<Person[]> {
    return await this.personDocumentModel.find().exec();
  }

  async findOne(id: string): Promise<Person> {
    return await this.personDocumentModel.findById(id).exec();
  }

  async findMany(ids: Types.ObjectId[]): Promise<Person[]>{
    return await this.personDocumentModel.find({_id: {$in: ids}}).exec();
  }
}