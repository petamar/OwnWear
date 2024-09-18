import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import {FloatLabelModule} from 'primeng/floatlabel';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule,FloatLabelModule,  CommonModule, InputTextModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})

export class LoginComponent {
    loginForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ]),

    });

    submitted = false; //boolean to track if person clicked on log in

    // check email input
    get email(){
        return this.loginForm.get('email');
    }

    //check password input
    get password(){
        return this.loginForm.get('password');
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {

            
        }
    }
}
