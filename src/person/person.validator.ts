import { Person } from "./person.schema";

export function isPersonEntityValid(person: Person): boolean{
  if (typeof person.firstName !== 'string' || typeof person.lastName !== 'string') {
    return false;
  }

  if (typeof person.rating !== 'number' || person.rating < 0 || person.rating > 100) {
    return false;
  }

  return !(!(person.ratedAt instanceof Date) || isNaN(person.ratedAt.getTime()));
}