import { BadRequestException, Injectable } from "@nestjs/common";
import { PersonInput } from "./person.entity";
import { Person, PersonDocument } from "./person.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

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

    if(!this.isPersonEntityValid(newPersonModel)){
      throw new BadRequestException(`Person not valid: ${newPersonModel}`);
    }

    const createdPerson = new this.personDocumentModel(newPersonModel);
    return await createdPerson.save();
  }

  isPersonEntityValid(person: Person): boolean{
    if (typeof person.firstName !== 'string' || typeof person.lastName !== 'string') {
      return false;
    }

    if (typeof person.rating !== 'number' || person.rating < 0 || person.rating > 100) {
      return false;
    }

    return !(!(person.ratedAt instanceof Date) || isNaN(person.ratedAt.getTime()));
  }
}