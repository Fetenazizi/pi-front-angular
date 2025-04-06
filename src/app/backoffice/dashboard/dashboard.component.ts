import { Component , OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css',
    "../../../assets/BackOffice/assets/css/bootstrap.min.css",
              "../../../assets/BackOffice/assets/css/demo.css",
              "../../../assets/BackOffice/assets/css/fonts.css",
              "../../../assets/BackOffice/assets/css/fonts.min.css",
              "../../../assets/BackOffice/assets/css/kaiadmin.css",
              "../../../assets/BackOffice/assets/css/kaiadmin.min.css"
  ]
  

})

export class DashboardComponent  {
  //implements OnInit
  // ngOnInit(): void {
  //   this.loadScript("../../../assets/BackOffice/assets/js/core/jquery-3.7.1.min.js").then(() => {
  //     this.loadScript("../../../assets/BackOffice/assets/js/core/popper.min.js").then(() => {
  //       this.loadScript("../../../assets/BackOffice/assets/js/core/bootstrap.min.js").then(() => {
  //         this.loadScript("../../../assets/BackOffice/assets/js/kaiadmin.js");
  //         this.loadScript("../../../assets/BackOffice/assets/js/kaiadmin.min.js");
  //         this.loadScript("../../../assets/BackOffice/assets/js/setting-demo.js");
  //         this.loadScript("../../../assets/BackOffice/assets/js/setting-demo2.js");
  //       });
  //     });
  //   });
  // }
  // loadScript(src: string): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     if (document.querySelector(`script[src="${src}"]`)) {
  //       resolve(); // Ne charge pas le même script plusieurs fois
  //       return;
  //     }

  //     const script = document.createElement('script');
  //     script.src = src;
  //     script.type = 'text/javascript';
  //     script.async = false;
  //     script.onload = () => resolve();
  //     script.onerror = () => reject(`Failed to load script: ${src}`);
  //     document.body.appendChild(script);
  //   });
  // }
}
