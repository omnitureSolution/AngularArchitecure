import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "@app/features-modules/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  userName = "";
  constructor(private authService: AuthService, private router: Router) {}
  @Input()
  lead: any;
  ngOnInit() {
    const login = JSON.parse(window.localStorage.getItem("login"));
    if (login) {
      this.userName = login.fullname;
    }
  }

  togglediv() {
    if (this.lead.className === "toggled") {
      this.lead.className = "";
    } else {
      this.lead.className = "toggled";
    }
  }

  logout() {
    this.authService.localLogout();
    this.router.navigateByUrl("/");
  }
}
