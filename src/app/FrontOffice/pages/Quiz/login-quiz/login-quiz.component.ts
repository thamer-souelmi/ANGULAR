import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {ResultQuizService} from "../../../../Services/result-quiz.service";
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ResultQuiz} from "../../../../Models/result-quiz"; // Import NgForm for form validation

@Component({
  selector: 'app-login-quiz',
  templateUrl: './login-quiz.component.html',
  styleUrls: ['./login-quiz.component.css']
})
export class LoginQuizComponent {
  quizForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private resultQuizService: ResultQuizService
  ) {
    this.quizForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  navigateToQuiz() {
    if (this.quizForm.valid) {
      this.submitForm();
    }
  }

  hasError(controlName: string, errorName: string) {
    return this.quizForm.get(controlName)?.hasError(errorName) && this.quizForm.get(controlName)?.touched;
  }

  submitForm() {
    const email = this.quizForm.value.email;
    const resultQuiz: ResultQuiz = { email: email };

    this.resultQuizService.addResult(resultQuiz).subscribe(
      () => {
        console.log('Result added successfully');
        this.router.navigate(['/quiz']);
      },
      (error) => {
        console.error('Error adding result:', error);
      }
    );
  }
}
