import { Component, OnInit } from '@angular/core'
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'
import {Router} from "@angular/router";

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {
  state = AuthenticatorCompState.LOGIN
  firebasetsAuth: FirebaseTSAuth
  constructor (private readonly bottomSheetRef: MatBottomSheetRef,public rout:Router) {
    this.firebasetsAuth = new FirebaseTSAuth()
  }

  ngOnInit (): void {
  }

  onResetClick (resetEmail: HTMLInputElement) {
    const email = resetEmail.value
    if (this.isNotEmpty(email)) {
      this.firebasetsAuth.sendPasswordResetEmail(
        {
          email: email,
          onComplete: (err) => {
            this.bottomSheetRef.dismiss()
          }
        }
      )
    }
  }

  onLogin (loginEmail: HTMLInputElement, loginPassword: HTMLInputElement) {
    const email = loginEmail.value
    const password = loginPassword.value

    if (this.isNotEmpty(email) && this.isNotEmpty(password)) {
      this.firebasetsAuth.signInWith(
        {
          email: email,
          password: password,
          onComplete: (uc) => {
            this.bottomSheetRef.dismiss()
            this.rout.navigate(["/postfeed"])
          },
          onFail: (err) => {
            alert(err)
          }
        }
      )
    }
  }

  onRegisterClick (
    registerEmail: HTMLInputElement,
    registerPassword: HTMLInputElement,
    registerConfirmPassword: HTMLInputElement) {
    const email = registerEmail.value
    const password = registerPassword.value
    const confirmPassword = registerConfirmPassword.value
    if
    (
      this.isNotEmpty(email) &&
      this.isNotEmpty(password) &&
      this.isNotEmpty(confirmPassword) &&
      this.isAMatch(password, confirmPassword)
    ) {
      this.firebasetsAuth.createAccountWith(
        {
          email: email,
          password: password,
          onComplete: (uc) => {
            alert('Account Created')
            this.bottomSheetRef.dismiss()
          },
          onFail: (err) => {
            alert('Failed to create the account')
          }
        }
      )
    }
  }

  isNotEmpty (text: string) {
    return text != null && text.length > 0
  }

  isAMatch (text: string, comparedWith: string) {
    return text == comparedWith
  }

  onForgotPasswordClick () {
    this.state = AuthenticatorCompState.FORGOT_PASSWORD
  }

  onCreateAccountClick () {
    this.state = AuthenticatorCompState.REGISTER
  }

  onLoginClick () {
    this.state = AuthenticatorCompState.LOGIN
  }

  isLoginState () {
    return this.state == AuthenticatorCompState.LOGIN
  }

  isRegisterState () {
    return this.state == AuthenticatorCompState.REGISTER
  }

  isForgotPasswordState () {
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD
  }

  getStateText () {
    switch (this.state) {
      case AuthenticatorCompState.LOGIN:
        return 'Login'
      case AuthenticatorCompState.REGISTER:
        return 'Register'
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return 'Forgot Password'
    }
  }
}

export enum AuthenticatorCompState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
