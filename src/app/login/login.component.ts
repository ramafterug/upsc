import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/// <reference path = "../models.ts" />
import * as afterUGExtended from "../models";
import { AuthenticationService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                var token = result.Token;
                if (token != "") {
                      localStorage.setItem('currentUser', JSON.stringify({ username: this.model.username, token: token }));
                    this.router.navigate(['/']);

                } else {
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }
}
