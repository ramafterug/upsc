/// <reference path = "../models.ts" />
import * as afterUGExtended from "../models";
//import afterugExtended = require('../models');
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Test } from './test';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioControlValueAccessor } from "../radio_value_accessor";
//import { Choices } from '../models';

import { TestQuestionService } from './test-questions.service';
@Component({
  moduleId: module.id,
  selector: 'test',
  templateUrl: 'test.component.html',
  styleUrls: ['test.component.css'],


})

@NgModule({
  imports: [

    FormsModule
  ],
  declarations: [RadioControlValueAccessor]

})
export class TestComponent implements OnInit {
  //Properties
  private test = new Test();
  idNo: number;
  userID: number;
  userChoiceID: number = 0;
  singleQuestionHitCount: number = 0;
  NewAttempts: afterUGExtended.afterugExtended.Attempts[];
  MarkedQuestions: afterUGExtended.afterugExtended.TestMarkAQuestion[];
  IsMarked: boolean = false;

  newQuestion: number = 0;
  constructor(
    private testQuestionService: TestQuestionService,
    private route: ActivatedRoute,
    // private location: Location
  ) {
    //Randomise here
    this.test.IsQuestionRandom = true;
    this.MarkedQuestions = [];

  }
  Existing() {
    this.IsMarked = !this.IsMarked;
    // var tempUserID = 
    var tempMarked = new afterUGExtended.afterugExtended.TestMarkAQuestion();
    tempMarked.QuestionID = this.test.currentQuestion.QuestionID;
    tempMarked.UserID = this.userID;
    if (this.IsMarked == true) {
      //this.MarkedQuestions.push

      this.MarkedQuestions.push(tempMarked);
     // alert("Word is marked");
      console.log(this.MarkedQuestions);
    } else {
      
      //this.test.currentQuestion.QuestionID;
      for (var i = 0; i < this.MarkedQuestions.length; i++) {
        if (this.MarkedQuestions[i].QuestionID == this.test.currentQuestion.QuestionID) {
          this.MarkedQuestions.splice(i, 1);
          console.log(this.MarkedQuestions);
          alert("Word is Unmarked");

        }
      }
      /*var index = this.MarkedQuestions.indexOf(tempMarked, 0);
      console.log("index: " + index);
      if (index > -1) {
        this.MarkedQuestions.splice(index, 1);
         console.log(this.MarkedQuestions);
      }*/

    }
  }
  ComputeScoreForAQuestion() {

  }
  PreviousQuestion(): void {

    if (this.test.questionCount != 1) {
      //Evaluate Answer

      // Move to next question
      this.test.questionCount = this.test.questionCount - 1;
      this.test.currentQuestion = this.test.QuestionList[this.getCurrentQuestionNumber() - 1];
      this.randomizeChoices();

    } else {
      alert('Cannot go previous this is the first question');
    }

  }

  updateAndAddCurrentHit(radioValue: number) {
    // console.log(radioValue);
    var attemptIndex = this.getCurrentQuestionNumber() - 1;
    if (this.singleQuestionHitCount == 0) {
      this.NewAttempts[attemptIndex].Hits = [];
    }
    this.singleQuestionHitCount++;
    var currentHit = new afterUGExtended.afterugExtended.Hits();
    //this.currentHit.AttemptID = this.currentAttempt.AttemptID;// Confusion on this attempt id will be generated only on insert
    currentHit.UserAnswerForTheHit = this.userChoiceID;
    console.log("UserAnswerForTheHit:-> " + currentHit.UserAnswerForTheHit);
    console.log("userChoiceID:-> " + this.userChoiceID);
    var currentAttemptHit = new afterUGExtended.afterugExtended.Hits();
    var currentAttemptHitsWhichNoOfHit = 0;
    var currentHitArrayLength = this.NewAttempts[attemptIndex].Hits.length;
    if (this.NewAttempts[attemptIndex].Hits.length == 0) {
      currentAttemptHitsWhichNoOfHit = 0;
    } else {
      currentAttemptHit = (this.NewAttempts[attemptIndex].Hits[currentHitArrayLength - 1]);
      currentAttemptHitsWhichNoOfHit = currentAttemptHit.WhichNoOfHit;
    }
    currentHit.WhichNoOfHit = currentAttemptHitsWhichNoOfHit + 1;

    this.NewAttempts[attemptIndex].Hits[currentHitArrayLength] = currentHit;
  }

  CalculateNextAttemptNumber(): number {

    return ((this.test.currentQuestion.Attempts[(this.test.currentQuestion.Attempts.length - 1)].AttemptNumber) + 1);//Change this

  }

  setCurrentAttempt() {


    //set current attempt and add current attempt
    this.singleQuestionHitCount = 0;

    var currentAttempt = new afterUGExtended.afterugExtended.Attempts();

    var currentQuestionLastAttempt = new afterUGExtended.afterugExtended.Attempts();
    var currentQuestionLastAttemptNumber = 0;
    var alreadyExistingAttemptsInDB = this.test.currentQuestion.Attempts.length;
    if (alreadyExistingAttemptsInDB == 0) {
      //currentAttemptHitsWhichNoOfHit = currentAttemptHit.WhichNoOfHit;
      currentQuestionLastAttemptNumber = 0;
    } else {

      currentQuestionLastAttempt = this.test.currentQuestion.Attempts[(alreadyExistingAttemptsInDB - 1)];
      currentQuestionLastAttemptNumber = currentQuestionLastAttempt.AttemptNumber;
    }
    currentAttempt.AttemptNumber = currentQuestionLastAttemptNumber + 1;
    currentAttempt.QuestionID = this.test.currentQuestion.QuestionID;
    //console.log("QID:->" +  currentAttempt.QuestionID);
    currentAttempt.TestOrStudySession = "PreTest";//Make it dynamic later based on it is a test or TestOrStudySession
    currentAttempt.TimeTaken = 0;// Start the time when question loads and stop before this statement and then compute difference and Assign
    currentAttempt.UserFinalHitAnswer = 1;//Current choiceID. GEt the value from radio click
    currentAttempt.UserID = 1;//Make it dynamic later
    //    this.currentAttempt.Hits = this.currentAttemptHits;

    var tempCurrentAttempt = currentAttempt;
    var attemptIndex = this.getCurrentQuestionNumber() - 1;
    this.NewAttempts[attemptIndex] = tempCurrentAttempt;





  }

  NextQuestion(): void {
    this.newQuestion++;
    if (this.test.questionCount != this.test.QuestionList.length) {
      if (this.userChoiceID == this.test.currentQuestion.CorrectChoiceID) {
        this.test.Score = this.test.Score + 1;
      }
      this.test.questionCount = this.test.questionCount + 1;
      this.test.currentQuestion = this.test.QuestionList[this.getCurrentQuestionNumber() - 1];
      this.randomizeChoices();
      this.setCurrentAttempt();
      this.IsMarked = false;
    } else {
      if (this.userChoiceID == this.test.currentQuestion.CorrectChoiceID) {
        this.test.Score = this.test.Score + 1;
      }
      this.IsMarked = false;
      //this.setCurrentAttempt();
      this.saveAttempsts();
      alert('Cannot go further this is the last question');
    }

  }

  saveAttempsts() {
    this.testQuestionService.saveAttemptsToDB(this.NewAttempts)
      .subscribe(
      status => {
        alert(status);
      },
      err => {
        alert(err);
        console.log(err);
      });

  }
  getTestId() {
    this.route.params.forEach((params: Params) => {
      this.idNo = +params['id'];
      this.userID = +params['userID'];
    });
  }

  loadQuestions() {
    this.testQuestionService.getQuestions(this.idNo, this.userID)
      .subscribe(
      questions => {

        this.test.questionCount = 1;
        this.test.QuestionList = questions;
        this.randomizeQuestions();
        this.test.currentQuestion = this.test.QuestionList[this.getCurrentQuestionNumber() - 1];
        this.randomizeChoices();
        this.NewAttempts = [];
        var i = 0;
        var finalLoopValue = this.test.QuestionList.length;

        for (i = 0; i < finalLoopValue; i++) {
          this.NewAttempts[i] = new afterUGExtended.afterugExtended.Attempts();
          this.NewAttempts[i].Hits = [];
        }
        this.setCurrentAttempt();

      },
      err => {
        console.log(err);
      });


  }

  saveNewQuestionAttempt() {

  }
  randomizeQuestions() {
    this.test.QuestionOrder = [];
    for (var i = 1; i <= this.test.QuestionList.length; i++) {

      this.test.QuestionOrder.push(i);
    }
    if (this.test.IsQuestionRandom == true) {
      //Random true
      this.shuffle(this.test.QuestionOrder);
      console.log(this.test.QuestionOrder);
    }

  }

  randomizeChoices() {
    this.test.currentQuestion.OriginalChoiceOrder = [];
    this.test.currentQuestion.RandomChoiceOrder = [];
    this.test.currentQuestion.FinalFourShuffledChoices = [];

    for (var i = 1; i <= this.test.currentQuestion.Choices.length; i++) {
      var choice: afterUGExtended.afterugExtended.Choices;
      choice = this.test.currentQuestion.Choices[i - 1];
      this.test.currentQuestion.OriginalChoiceOrder.push(choice);
    }


    // Assign originalChoice order to randomchoice order
    this.test.currentQuestion.RandomChoiceOrder = this.test.currentQuestion.OriginalChoiceOrder;

    //Shuffle the randomchoiceorder array
    this.shuffle(this.test.currentQuestion.RandomChoiceOrder);
    //Remove the correctchoiceid from random choice order array
    //var indexDummy = this.test.currentQuestion.RandomChoiceOrder.indexOf(this.test.currentQuestion.CorrectChoiceID, 0);

    var index: number;
    var correctChoice: afterUGExtended.afterugExtended.Choices;
    for (var i = 1; i <= this.test.currentQuestion.Choices.length; i++) {
      var tempChoice: afterUGExtended.afterugExtended.Choices;
      tempChoice = this.test.currentQuestion.RandomChoiceOrder[i - 1];
      if (this.test.currentQuestion.CorrectChoiceID == tempChoice.ChoiceID) {
        index = i - 1;
        correctChoice = tempChoice;
      }
    }
    if (index > -1) {
      this.test.currentQuestion.RandomChoiceOrder.splice(index, 1);
    }
    //insert correctchoiceid in the beginning of finalfourchoices array. Add other 3 choices from first 3 elements of randomchoiceorder
    for (var i = 1; i <= 4; i++) {
      if (i == 1) {
        this.test.currentQuestion.FinalFourShuffledChoices[i - 1] = correctChoice;
      } else {
        this.test.currentQuestion.FinalFourShuffledChoices.push(this.test.currentQuestion.RandomChoiceOrder[i - 2]);
      }

    }
    //shuffle the final4 choiceorder array
    this.shuffle(this.test.currentQuestion.FinalFourShuffledChoices);
    //Bind to the UI
    console.log(this.test.currentQuestion.FinalFourShuffledChoices);
  }


  getCurrentQuestionNumber(): number {
    var currentQuestionNumber: number;
    var questionCount: number;
    questionCount = this.test.questionCount - 1;
    return currentQuestionNumber = this.test.QuestionOrder[questionCount];
  }
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }



  ngOnInit(): void {

    this.getTestId();
    this.test.QuestionList = [];
    this.loadQuestions();


  }

}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/