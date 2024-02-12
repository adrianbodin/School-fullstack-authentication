import {IReview} from "./IReview";

export interface IMovie {
  id: number,
  title: string,
  releaseYear: number,
  reviews: IReview[],
}
