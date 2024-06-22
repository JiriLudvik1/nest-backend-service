import { BadRequestException, Injectable } from "@nestjs/common";
import { PersonInput } from "./person.entity";
import { Person, PersonDocument } from "./person.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { isPersonEntityValid } from "./person.validator"

@Injectable()
export class PersonService {
  constructor(@InjectModel(Person.name) private personDocumentModel: Model<PersonDocument>) {
  }

  async createNewPersonEntity(person: PersonInput): Promise<Person>{
    const newPersonModel:Person ={
      firstName: person.name.first,
      lastName: person.name.last,
      rating: person.rating,
      ratedAt: new Date(person.ratedAt),
    };

    if(!isPersonEntityValid(newPersonModel)){
      throw new BadRequestException(`Person not valid: ${newPersonModel}`);
    }

    const createdPerson = new this.personDocumentModel(newPersonModel);
    return await createdPerson.save();
  }

  async findAll(): Promise<Person[]> {
    return await this.personDocumentModel.find().exec();
  }

  async findOne(id: string): Promise<Person> {
    return await this.personDocumentModel.findById(id).exec();
  }
}