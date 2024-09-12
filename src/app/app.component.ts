import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { error } from 'console';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VERSION } from '@angular/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],  // Include CommonModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('paymentRef', { static: false }) paymentRef!: ElementRef;

  title = 'payment';
  taxRate = 0.05;
  shippingRate = 15.00;
  fadeTime = 300;
  clickMe = false;
  amount = 0;
  products = [
    {
      title: 'Peach 70 Niacin Serum',
      description: 'Formulated with a potent 5% concentration of Niacinamide, this serum effectively inhibits melanin pigment ensuring a more balanced complexion.',
      image: 'https://i.pinimg.com/564x/7a/53/3a/7a533a5bfd824185f03b629db47342a0.jpg',
      price: 350,
      quantity: 1,
      linePrice: 350.00
    },
    {
      title: 'Anua Niacinamide 10% + TXA 4% Dark Spot Correcting Serum',
      description: 'Containing 10% Niacinamide, 4% Tranexamic Acid and 2% Arbutin, a powerful trio of ingredients to target dull skin, and enlarged pores.',
      image: 'https://i.pinimg.com/736x/fd/57/74/fd57749cbed616aa48cb1ee439b1e3ab.jpg',
      price: 480,
      quantity: 1,
      linePrice: 480.00
    }
  ];
  data: any;


  constructor(private router: Router, private cdRef: ChangeDetectorRef, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    //this.amount = this.payment.totalAmount;
    //console.log('wind',window.paypal);
  }

  goToPayment() {
    //this.router.navigate(['/payment']);
    this.clickMe = true;
    this.cdRef.detectChanges();
    //window.paypal.Buttons().render(this.paymentRef.nativeElement)
    window.paypal.Buttons(
      {
        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.total.toString(),  // Change this line
                  currency_code: 'USD'
                }
              }
            ]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            //console.log(details)
            const id = details.id;
            if (details.status === 'COMPLETED') {
              // this.payment.transcationID = details.id;
              // this.router.navigate(['confirm']);
              alert(`Payment successful. Your transaction ID: ${id}`);
            }
          });
        },
        onError: (error: any) => {
          console.log(error)
        }
      }
    ).render(this.paymentRef.nativeElement)
  }

  cancel() {
    this.clickMe = false;
  }
  //   openDialog(): void {
  //     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //       data: { },
  //       width: '500px',
  //       height: '255px',
  //       hasBackdrop: true,
  //       panelClass: 'hello',
  //       disableClose: true
  //     });
  // }



  get subtotal(): number {
    return this.products.reduce((acc, product) => acc + product.linePrice, 0);
  }

  get tax(): number {
    return this.subtotal * this.taxRate;
  }

  get shipping(): number {
    return this.subtotal > 0 ? this.shippingRate : 0;
  }

  get total(): number {
    return this.subtotal + this.tax + this.shipping;
  }

  updateQuantity(product: any, event: any): void {
    const quantity = +event.target.value;
    product.linePrice = product.price * quantity;
    this.recalculateCart();
  }

  removeItem(index: number): void {
    this.products.splice(index, 1);
    this.recalculateCart();
  }

  recalculateCart(): void {
    // The recalculation is done automatically through Angular's binding system.
    if (this.total === 0) {
      // Optionally hide checkout button
    }
  }
}

// @Component({
//   selector: 'app-confirmation-dialog',
//   template: `
//   <div mat-dialog-content>
//   <div class="closeDialog">
//         <i class="fa fa-times closeBtn" (click)="closeDialog()" aria-hidden="true"></i>
//     </div>

//    <h1 mat-dialog-title class="mailoption">Choose a Mail account provider…</h1>
//       <div mat-dialog-actions class="overviewSave savefilenameBtn">
//           <button type="reset" class="btn btn-default btncancel btnfont" (click)="closeDialog()">Cancel</button> 
//            <button type="submit" class="btn btn-default btnsave savefile pull-right btnfont" (click)="continue()">Continue</button> 
//       </div> 
//   </div>
// `,
//   styleUrls: ['./app.component.css']
// })
// export class ConfirmationDialogComponent {
//   editDoc: any;

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     public dialogRef: MatDialogRef<ConfirmationDialogComponent>
//   ) { }

//   ngOnInit() {

//   }

//   continue() {
//     this.dialogRef.close('continue');
//   }
//   closeDialog() {
//     this.dialogRef.close()
//   }

// }
