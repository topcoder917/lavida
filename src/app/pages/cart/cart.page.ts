import { Component, OnInit } from '@angular/core';
import {StorageService} from '../../services/storage/storage.service';
import {CartSettingService} from '../../services/global-carttsetting/cart-setting.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController} from '@ionic/angular';
import { DbService } from '../../services/sqlite/db.service';
import {  ToastController } from '@ionic/angular';
import { Location } from "@angular/common";

import { config } from 'src/app/config/config';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  pageTitle = 'My Cart';
  isLoggedIn = false;
  cartProductList = [];
  order_all_amount = 0;
  global_minimum_amount = 0;
  preorder_amount = 0;
  minimum_order_amount = 0;
  globalSetting : any;
  isShowCartAlert = false;
  isShowCartMinimum = false;
  img_dir = '';
  isEmptyCart = false;
  cartBadgeCount = 0;
  loginedUserInfo : any;
  constructor(
    public storageService: StorageService,
    public webview: WebView,
    public cartSettingService: CartSettingService,
    public file: File,
    public db: DbService,
    public alertController: AlertController,
    public toastController: ToastController,
    public location: Location,
  ) { }

  ngOnInit() {
    this.isLoggedIn = true;
  }
  
  async ionViewWillEnter(){
    this.img_dir = this.pathForImage(this.file.documentsDirectory + 'product_img/');
    this.loginedUserInfo = await this.storageService.getObject("loginedUser");

    this.cartProductList = await this.storageService.getObject(config.cart_products);
    console.log(this.cartProductList);
    if(this.cartProductList == null){
      this.cartProductList = [];
      this.isEmptyCart = true;
      this.cartBadgeCount = 0;
    }else{
      this.isEmptyCart = false;
      this.cartBadgeCount = this.cartProductList.length;

    }

    this.getAmountInfo();
  }

  getAmountInfo(){
    this.globalSetting = this.cartSettingService.globalSetting;

    var objOrderAmount = this.getOrderAllAmount();

    this.order_all_amount = objOrderAmount.all_amount;
    this.preorder_amount = objOrderAmount.preorder_amount;
    this.global_minimum_amount = this.globalSetting.minimum_order;

    var order_without_preorder = this.order_all_amount - this.preorder_amount;

    if(this.global_minimum_amount > order_without_preorder){
      this.minimum_order_amount = this.global_minimum_amount - order_without_preorder;
      this.isShowCartMinimum = true;
    }else
      this.isShowCartMinimum = false;

    if(this.order_all_amount > this.globalSetting.amount_alert_threshold && this.order_all_amount < this.globalSetting.amount_alert_ceiling)
      this.isShowCartAlert = true;
    else
      this.isShowCartAlert = false;

  }

  getOrderAllAmount(){
    var amount = 0;
    var preOrderAmount = 0;
    for(var i=0; i<this.cartProductList.length; i++){
      amount += this.cartProductList[i].amount; 
      if(this.cartProductList[i].productPreOrder == 1)
        preOrderAmount += this.cartProductList[i].amount; 
    }
    return {
      all_amount: amount,
      preorder_amount: preOrderAmount
    };
  }

  changeQty(e, productIndex){
    var selectedQty = e.detail.value;

    if(selectedQty >= this.cartProductList[productIndex].productQtySlab && this.cartProductList[productIndex].productQtySlab > 0){
      this.cartProductList[productIndex].bulkPrice = this.cartProductList[productIndex].productPriceSlab;
    }else
      this.cartProductList[productIndex].bulkPrice = this.cartProductList[productIndex].productPrice;

    this.cartProductList[productIndex].amount =  this.cartProductList[productIndex].bulkPrice * selectedQty;
    this.cartProductList[productIndex].qty =  selectedQty;

    this.getAmountInfo();
    this.storageService.setObject(config.cart_products, this.cartProductList);
  }

  removeProduct(index){
    if (index > -1) {
      this.cartProductList.splice(index, 1);
    }
    console.log(this.cartProductList);
    if(this.cartProductList == null || this.cartProductList.length == 0){
      console.log("1212121");
      this.isEmptyCart = true;
      this.cartBadgeCount = 0;
    }
    else
      this.cartBadgeCount = this.cartProductList.length;  

    this.storageService.setObject(config.cart_products, this.cartProductList);
    this.getAmountInfo();

  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  saveOrderMaster(){
    var dt = new Date(); 
    
    var order_date = `${
      dt.getFullYear().toString().padStart(4, '0')}-${
      (dt.getMonth()+1).toString().padStart(2, '0')}-${
      dt.getDate().toString().padStart(2, '0')} ${
      dt.getHours().toString().padStart(2, '0')}:${
      dt.getMinutes().toString().padStart(2, '0')}:${
      dt.getSeconds().toString().padStart(2, '0')}`;


    var str_query = "INSERT INTO saveordermaster ( order_date, user_id, order_amount) VALUES ";
    
    var rowArgs = [];
    var data = [];
      rowArgs.push("(?, ?, ?)");
      data = [order_date, this.loginedUserInfo.id, this.order_all_amount];

    str_query += rowArgs.join(", ");
    return this.db.addToSqlite(str_query, data);
  }

  async saveOrderDetails(insertedMasterId){
    var str_query = "INSERT INTO saveorderdetails (order_id, product_id, qty, price, product_code, product_name) VALUES ";
    var rowArgs = [];
    var data = [];
    this.cartProductList.forEach(function (cartproduct) {
      rowArgs.push("(?, ?, ?, ?, ?, ?)");
      data.push(insertedMasterId);
      data.push(cartproduct.productId);
      data.push(cartproduct.qty);
      data.push(cartproduct.bulkPrice);
      data.push(cartproduct.productCode);
      data.push(cartproduct.productName);
    });
    str_query += rowArgs.join(", ");
    return await this.db.addToSqlite(str_query, data);
  }

  async saveOrder(){
    var insertedMasterId = await this.saveOrderMaster();
    await this.saveOrderDetails(insertedMasterId);
    this.showToast();
  }

  clearCart() {
    if(this.isEmptyCart) return;
    this.alertController.create({
      header: 'Confrim',
      message: 'Are you sure clear cart?',
      buttons: [
        {
          text: 'No',
          handler: (data: any) => {
          }
        },
        {
          text: 'Yes',
          handler: (data: any) => {
            this.storageService.removeItem(config.cart_products);
            this.cartProductList = [];
            this.isEmptyCart = true;
            this.cartBadgeCount = 0;
            this.getAmountInfo();
          }
        }
      ],
      backdropDismiss: false

    }).then(res => {
      res.present();
    });
  }

  keepShopping(){
    this.location.back();
  }
  showToast() {
    this.toastController.create({
      header: '',
      message: 'Your order has been saved!',
      position: 'top',
      color: 'dark',
      duration: 1500
    }).then((obj) => {
      obj.present();
    });
  }
}
