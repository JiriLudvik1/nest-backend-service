export interface CreatePersonDto {
  browserId: string,
  name: { first: string, last: string };
  rating: number;
  ratedAt: Date
}