import { Option } from "./option";

export class QuizQuestion {
  questionId!: number;
  question!: string;
  options!: Option[];
}
