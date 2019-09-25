import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  titulo:string = 'Por favor iniciar sesion';
  usuario:Usuario;

  constructor(private _authService: AuthService,
              private router: Router) { 
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }

  login():void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Error Login', 'Username o password vacias!', 'error');
      return ;
    }

    this._authService.login(this.usuario).subscribe(response => {
      console.log(response);
      this.router.navigate(['/clientes']);
      Swal.fire('Login', `Hola ${response.username}, has iniciado sesion con exito!`, 'success');
    });
  }

}
