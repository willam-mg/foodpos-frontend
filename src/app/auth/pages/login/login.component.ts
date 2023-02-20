import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../service/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  submitted: boolean;
  formUser: FormGroup;
  subscription: Subscription;
  isLoading: boolean;

  constructor(
    private userService: AuthService,
    private router: Router,
    public loadingService: LoadingService,
    private changeDetector: ChangeDetectorRef,
    private title: Title) {
    this.title.setTitle('Nuevo administrador');
    this.user = new User();
    this.formUser = new FormGroup({
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(this.user.password, [
        Validators.required,
      ]),
    });
    this.submitted = false;
    this.subscription = new Subscription;
    this.isLoading = false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadingService.httpProgress().subscribe((status: boolean) => {
      this.isLoading = status;
      this.changeDetector.detectChanges();
    });
    this.changeDetector.detectChanges();
  }

  onSubmit() {
    try {
      if (this.formUser.invalid) {
        throw new Error('Entrada de datos invalido');
      }
      this.submitted = true;
      this.subscription.add(
        this.userService.login(this.formUser.value)
          .subscribe(async data => {
            this.user = data.user;
            localStorage.setItem(environment.store.userId, String(data.user.id));
            localStorage.setItem(environment.store.userToken, String(data.access_token));
            localStorage.setItem(environment.store.userData, JSON.stringify(data.user));
            if (data.user.punto_venta_id) {
              localStorage.setItem(environment.store.puntoVentaId, String(data.user.punto_venta_id));
              localStorage.setItem(environment.store.sucursal, String(data.user.punto_venta?.restaurante));
              localStorage.setItem(environment.store.puntoVentaNombre, String(data.user.punto_venta?.nombre_punto_venta));
            } 
            this.user = new User();
            this.submitted = false;
            this.router.navigate(['/']);
          })
      );
    } catch (error) {
      console.log(error);
    }
  }

}
