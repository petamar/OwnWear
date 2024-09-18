import {CommonModule} from '@angular/common';
import {NgModule, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { CalendarModule } from 'primeng/calendar';


@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, InputTextModule, FormsModule, ReactiveFormsModule, CalendarModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RegisterComponent {
    registerForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ]),
        street: new FormControl('', [
            Validators.required
        ]),
        streetNumber: new FormControl('', [
            Validators.required,
            Validators.pattern('[0-9]*') // Only allow numbers
        ]),
        postalCode: new FormControl('', [
            Validators.required,
            Validators.pattern('[0-9]*') // Only allow numbers
        ]),
        city: new FormControl('', [
            Validators.required
        ]),
        country: new FormControl('', [
            Validators.required,
            
        ]),
        dateOfBirth: new FormControl('', [
            Validators.required,
            
        ])
    });

    submitted = false; //boolean to track if person clicked on log in

    // check email input
    get email() {
        return this.registerForm.get('email');
    }

    //check password input
    get password() {
        return this.registerForm.get('password');
    }

    get street(){
        return this.registerForm.get('street');
    }

    get streetNumber(){
        return this.registerForm.get('streetNumber');
    }

    get postalCode(){
        return this.registerForm.get('postalCode');
    }

    get city(){
        return this.registerForm.get('city');
    }
    
    get country(){
        return this.registerForm.get('country');
    }

    get dateOfBirth(){
        return this.registerForm.get('dateOfBirth');
    }

    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {

        }
    }
}






