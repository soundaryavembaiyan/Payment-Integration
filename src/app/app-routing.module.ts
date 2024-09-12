import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component'; // your payment component
import { AppComponent } from './app.component';


export const routes: Routes = [
  {
      path: '',
      component: AppComponent,
      children: [
          { path: '', redirectTo: '', pathMatch: 'full' },
          { path: 'payment', component: PaymentComponent },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
