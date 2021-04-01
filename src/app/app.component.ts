import { Component } from "@angular/core";
import { Platform, LoadingController, AlertController } from "@ionic/angular";

import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DbService } from "./services/sqlite/db.service";
import { CustomerService } from "./services/online/customer/customer.service";
import { StorageService } from "./services/storage/storage.service";
import {
  FileTransfer,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { config } from "./config/config";
import { Router } from "@angular/router";
import { CartSettingService } from "./services/global-carttsetting/cart-setting.service";

const siteurl = config.Url;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  agent_regdate: any;
  checkExistDir: any;
  loading: any;
  productImageList = [];
  categoryImageList = [];
  bannerImageList = [];
  cartSettingList = [];
  loginedUser: any;
  loginState = false;
  isAccountSubmenus = false;
  public appMenus = [
    {
      title: "Home",
      url: "/home"
    },
    {
      title: "New Arrivals",
      url: "/new-arrival"
    },
    {
      title: "Shop All Categories",
      url: "/category"
    },
    {
      title: "About US",
      url: "/about-us"
    }
  ];

  public loggedin_appMenus = [
    {
      title: "Home",
      url: "/home"
    },
    {
      title: "New Arrivals",
      url: "/new-arrival"
    },
    {
      title: "Shop All Categories",
      url: "/category"
    },
    {
      title: "On Special",
      url: "/special"
    },
    {
      title: "Clearance",
      url: "/clearance"
    },
    {
      title: "About US",
      url: "/about-us"
    }
  ];

  public account_subMenus = [
    {
      title: "Profile",
      icon: "person",
      url: "/profile"
    },
    {
      title: "My Customers",
      icon: "people",
      url: "/customer"
    },
    {
      title: "Saved Orders",
      icon: "save",
      url: "/savedorders"
    }
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public db: DbService,
    public loadingController: LoadingController,
    private storageService: StorageService,
    public customerService: CustomerService,
    private file: File,
    private transfer: FileTransfer,
    private router: Router,
    public alertController: AlertController,
    public cartSettingService: CartSettingService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initialLocalDatabase();
    });
  }

  async initialLocalDatabase() {
    this.db.getDatabaseState().subscribe(async res => {
      if (res) {
        // this.bannerImageList = await this.db.loadHomeSlider();
        // await this.downloadBannerImages(this.bannerImageList);

        this.productImageList = await this.db.loadProductImages();
        await this.downloadProductImages(this.productImageList);

        // this.categoryImageList = await this.db.loadCategoryImages();
        // await this.downloadCategoryImages(this.categoryImageList);

        // this.cartSettingList = await this.db.getAllGlobalCartSetting();
        // this.cartSettingService.setGlobalInfo(this.cartSettingList);

        this.loginedUser = await this.storageService.getObject("loginedUser");

        if (this.loginedUser) this.loginState = true;
        else this.loginState = false;

        this.router.navigate(["/home"]);
      }
    });
  }

  async downloadBannerImages(imageData) {
    var img_initialized = await this.storageService.getObject(
      "bannerimg_initialized"
    );
    if (img_initialized) return;

    const loading = await this.loadingController.create({
      message: "Downloading Banner Images..."
    });
    await loading.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    for (var i = 0; i < imageData.length; i++) {
      let url = siteurl + "/upload/flash_banner_img/" + imageData[i].name;
      await fileTransfer.download(
        url,
        this.file.documentsDirectory + "banner_img/" + imageData[i].name
      );
    }
    this.storageService.setObject("bannerimg_initialized", true);
    loading.dismiss();
  }

  //get and download products and categories images
  async downloadProductImages(imageData) {
    var img_initialized = await this.storageService.getObject("prodimg_initialized");
    if(img_initialized) return;

    const loading = await this.loadingController.create({
      message: "Downloading Product Images..."
    });
    await loading.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    for (var i = 0; i < imageData.length; i++) {
      let url = siteurl + "/upload/product_img/resized/" + imageData[i].name;

      await this.file
        .checkFile(
          this.file.documentsDirectory + "product_img/",
          imageData[i].name + "/"
        )
        .then(async result => {
           console.log("111111111", imageData[i].name);
        })
        .catch(async err => {
          console.log("22222222222222", imageData[i].name);
          await fileTransfer.download(url, this.file.documentsDirectory + 'product_img/' + imageData[i].name).catch(async err => {console.log(err)});
        });
    }
    this.storageService.setObject("prodimg_initialized", true);
    loading.dismiss();
  }

  async downloadCategoryImages(imageData) {
    var img_initialized = await this.storageService.getObject(
      "catimg_initialized"
    );
    if (img_initialized) return;

    const loading = await this.loadingController.create({
      message: "Downloading Category Images..."
    });
    await loading.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    for (var i = 0; i < imageData.length; i++) {
      if (imageData[i].name != "NULL") {
        let url = siteurl + "/upload/prod_cat_img/" + imageData[i].name;
        await fileTransfer.download(
          url,
          this.file.documentsDirectory + "prod_cat_img/" + imageData[i].name
        );
      }
    }
    this.storageService.setObject("catimg_initialized", true);
    loading.dismiss();
  }

  gotoPage(url) {
    this.router.navigate([url]);
  }
  gotoAccountSubPage(url) {
    this.router.navigate([url]);
  }
}
//ionic cordova run ios --target="A2686E38-C7E4-44EF-9E96-B7C4C3DD4DB7" --livereload
