import { BadRequestException, Injectable } from "@nestjs/common";
import { PersonInput } from "./person.entity";
import { Person, PersonDocument } from "./person.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuid } from "uuid";

@Injectable()
export class PersonService {
  // constructor(@InjectModel(Person.name) private personDocumentModel: Model<PersonDocument>) {
  // }

  async createNewPersonEntity(person: PersonInput): Promise<Person>{
    const newPersonModel:Person ={
      id: uuid(),
      firstName: person.name.first,
      lastName: person.name.last,
      rating: person.rating,
      ratedAt: person.ratedAt,
    };

    if(!this.isPersonEntityValid(newPersonModel)){
      throw new BadRequestException(`Person not valid: ${newPersonModel}`);
    }

    return newPersonModel;
    // return await this.personDocumentModel.create(personDocumentModel)
  }

  isPersonEntityValid(person: Person): boolean{
    if (typeof person.firstName !== 'string' || typeof person.lastName !== 'string') {
      return false;
    }

    if (typeof person.rating !== 'number' || person.rating < 0 || person.rating > 5) {
      return false;
    }

    if (!(person.ratedAt instanceof Date) || isNaN(person.ratedAt.getTime())) {
      return false;
    }

    return true;
  }
}