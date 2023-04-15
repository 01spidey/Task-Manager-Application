import { Component,OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms'
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr'
import { ServerResponse } from 'src/model';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit{

  is_logged = false;

  constructor(
    private builder:FormBuilder,
    private router:Router,
    private service:AuthService,
    private toastr:ToastrService){
      
  }

  ngOnInit(): void {
    sessionStorage.clear();
    sessionStorage.setItem('user', 'null')
  }


  registerForm = this.builder.group({
    
    username:this.builder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(5)
    ])),
    
    password:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
    ])),

    rePassword:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
    ]))

  });

  proceedRegistration() {

    if (this.registerForm.valid) {
        const uname = this.registerForm.value.username!;
        const pass = this.registerForm.value.password!;
        const re_pass = this.registerForm.value.rePassword!;

        if(pass==re_pass){

            this.service.register(uname,pass).subscribe(
              (res:ServerResponse)=>{
                if(res.success){
                  sessionStorage.setItem('user', uname)

                  // setTimeout(() => {
                    this.toastr.success(res.message);
                    this.router.navigate(['home']);
                    // this.is_logged = false;
                  // }, 3000);
                }
                else {
                  this.registerForm.reset()
                  this.toastr.warning(res.message)
                  // this.is_logged =false
                }
              },
              err=>{
                this.toastr.error("Server not Reachable!!")
              }
            )
        } else this.toastr.warning("Password doesn't match!!")
        
    } else this.toastr.error('Form Invalid!!');
      
  }

  loginForm = this.builder.group({
    username:this.builder.control('', Validators.required),
    password:this.builder.control('',Validators.required),
  });

  proceedLogin(){
    if(this.loginForm.valid){
      const uname = this.loginForm.value.username!;
      const pass = this.loginForm.value.password!;
      
      this.is_logged = true

      this.service.login(uname,pass).subscribe(
        (res:ServerResponse)=>{
          if(res.success){
            sessionStorage.setItem('user', uname)
            setTimeout(() => {
              this.toastr.success(res.message);
              this.router.navigate(['home']);
              this.is_logged = false;
            }, 2000);
          }else {
            this.loginForm.reset()
            this.toastr.warning(res.message)
            this.is_logged =false
          }
        },
        err=>{
          this.toastr.error("Server not Reachable!!")
          this.is_logged =false
        }
      )
    }else this.toastr.error('Form Invalid!!')
  }



}
