import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { User } from 'src/app/shared/models/user';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  isAuthenticated: Boolean;
  user: User;
  sucursalName: string;
  isLoading: boolean;
  constructor(
    public authService: AuthService,
    public readonly router: Router,
    public title: Title,
    public loadingService: LoadingService,
    private changeDetector: ChangeDetectorRef) {
    this.isAuthenticated = false;
    this.user = new User();
    this.sucursalName = "";
    this.isLoading = false;
  }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((data) => {
      this.isAuthenticated = data;
    });
    this.sucursalName = this.authService.getSucursalName()!;
    this.user = this.authService.getUserIdentity() ? this.authService.getUserIdentity()! : new User();
  }

  ngAfterViewInit(): void {
    this.loadingService.httpProgress().subscribe((status: boolean) => {
      this.isLoading = status;
      this.changeDetector.detectChanges();
    });
    this.changeDetector.detectChanges();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
