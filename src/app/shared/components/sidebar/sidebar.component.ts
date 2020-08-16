import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  navbarOpen = false;
  showfinance = true;
  showproperty = false;
  showsettings = false;
  showlandlord = false;
  showsecurity = false;
  ismanager = false;
  ishr = false;
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  constructor() {}

  ngOnInit() {
    const authobj = JSON.parse(window.localStorage.getItem("login"));
    if (authobj && authobj.userSystem) {
      const findrole = authobj.userSystem.find(a=>a.roleId===7500)
      if (findrole) {
        this.ishr = true;
        this.ismanager = false;
      }

     var  manger = authobj.userSystem.find(a=>a.roleId===10000)
      if (manger) {
        this.ishr = false;
        this.ismanager = true;
      }
    }
  }

  showchild(type) {
    if (type === "finance") {
      this.showfinance = true;
      this.showsettings = false;
      this.showproperty = false;
      this.showlandlord = false;
      this.showsecurity = false;
    }

    if (type === "property") {
      this.showfinance = false;
      this.showsettings = false;
      this.showproperty = true;
      this.showlandlord = false;
      this.showsecurity = false;
    }

    if (type === "setting") {
      this.showfinance = false;
      this.showsettings = true;
      this.showproperty = false;
      this.showlandlord = false;
      this.showsecurity = false;
    }

    if (type === "landlord") {
      this.showfinance = false;
      this.showsettings = false;
      this.showproperty = false;
      this.showlandlord = true;
      this.showsecurity = false;
    }
    if (type === "security") {
      this.showfinance = false;
      this.showsettings = false;
      this.showproperty = false;
      this.showlandlord = false;
      this.showsecurity = true;
    }
  }
}
