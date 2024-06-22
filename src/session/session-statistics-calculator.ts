import { Session } from "./session.schema";
import { Person } from "../person/person.schema";

export function calculateSessionStatistics(session: Session, ratedUsers: Person[]): SessionsStatisticsResult{
  const sortedUsersByRatedAt = ratedUsers.toSorted((a, b) => a.ratedAt.getTime() - b.ratedAt.getTime())
  return {
    browserId: session.browserId,
    sessionCreatedAt: session.createdAt,
    firstRatedAt: sortedUsersByRatedAt[0].ratedAt,
    lastRatedAt: sortedUsersByRatedAt[sortedUsersByRatedAt.length -1].ratedAt,
    userRatedCount: sortedUsersByRatedAt.length,
    averageRating: calculateAverageRating(ratedUsers)
  }
}

function calculateAverageRating(ratedUsers: Person[]): number{
  const ratings = ratedUsers.map(u => u.rating);
  return ratings.reduce((a, b) => a + b, 0) / ratings.length
}

export interface SessionsStatisticsResult{
  browserId: string,
  sessionCreatedAt: Date,
  firstRatedAt: Date,
  lastRatedAt: Date,
  userRatedCount: number,
  averageRating: number,
}