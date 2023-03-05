import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowComponent } from './pages/show/show.component';
import { CreateComponent } from './pages/create/create.component';
import { IndexComponent } from './pages/index/index.component';
import { ReciboComponent } from './pages/recibo/recibo.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'create',
    component: CreateComponent,
    data: {
      breadcrumb: 'Nueva venta'
    }
  },
  {
    path: 'recibo',
    component: ReciboComponent,
    data: {
      breadcrumb: 'Recibo'
    }
  },
  {
    path: 'show',
    component: ShowComponent,
    data: {
      breadcrumb: 'Ver'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
