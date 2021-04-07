// app-routing.module.ts

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tablinks',
    loadChildren: () => import('./pages/tablinks/tablinks.module').then( m => m.TablinksPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./pages/category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/order/order.module').then( m => m.OrderPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./pages/customer/customer.module').then( m => m.CustomerPageModule)
  },
  {
    path: 'product/:id',
    loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'new-arrival',
    loadChildren: () => import('./pages/new-arrival/new-arrival.module').then( m => m.NewArrivalPageModule)
  },
  {
    path: 'special',
    loadChildren: () => import('./pages/special/special.module').then( m => m.SpecialPageModule)
  },
  {
    path: 'clearance',
    loadChildren: () => import('./pages/clearance/clearance.module').then( m => m.ClearancePageModule)
  },
  {
    path: 'product-detail',
    loadChildren: () => import('./pages/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'savedorders',
    loadChildren: () => import('./pages/savedorders/savedorders.module').then( m => m.SavedordersPageModule)
  },
  {
    path: 'checkoutlist',
    loadChildren: () => import('./pages/checkoutlist/checkoutlist.module').then( m => m.CheckoutlistPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }