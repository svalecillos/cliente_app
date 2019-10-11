import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';

//Material
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { FormComponent } from './components/cliente/form.component';
import { DetalleComponent } from './components/cliente/detalle/detalle.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { LoginComponent } from './components/usuario/login.component';
import { DetalleFacturaComponent } from './components/facturas/detalle-factura.component';
import { FacturasComponent } from './components/facturas/facturas.component';

//Services
import { ClienteService } from './service/cliente.service';

//Guard
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

//Interceptor
import { TokenInterceptor } from './components/usuario/interceptors/token.interceptor';
import { AuthInterceptor } from './components/usuario/interceptors/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Registramos de forma global la variable locar, en este caso español españa
registerLocaleData(localeES, 'es');

const routes:Routes = [
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'clientes', component: ClienteComponent},
  {path: 'clientes/page/:page', component: ClienteComponent},
  {path: 'clientes/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'clientes/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'login', component: LoginComponent},
  {path: 'facturas/:id', component: DetalleFacturaComponent},
  {path: 'facturas/form/:clienteId', component: FacturasComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClienteComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [
    ClienteService,
    { provide: LOCALE_ID, useValue: 'es'},
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }