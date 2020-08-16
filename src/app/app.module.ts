/** Angular core modules */
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

/** Routes */
import { AppRoutingModule } from './app-routing.module';
/** Modules */
import { AppComponent } from './app.component';

import { HttpServiceModule } from '@shared/async-services/http';
import { UtilityModule } from '@shared/utility';
/** guards */
import { AuthGuard } from '@shared/guards/auth.guard';
import { CanDeactivateGuard } from '@shared/guards/can-deactivate.guard';
/** Services */
/** Third party modules */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthModule } from './features-modules/auth/auth.module';
import { LoaderComponent } from '@shared/spinner/loader.component';
import { ToastrModule } from 'ngx-toastr';
import { ForgetPasswordComponent } from './features-modules/auth/forget-password/forget-password.component';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdatePasswordComponent } from './features-modules/auth/update-password/update-password.component';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function tokenGetter() {
  return localStorage.getItem('id_token');
}

@NgModule({
  declarations: [AppComponent,LoaderComponent,ForgetPasswordComponent,UpdatePasswordComponent],
  imports: [
    /** Angular core dependencies */
    BrowserModule,
    HttpClientModule,
    /** App custom dependencies */
    AuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PasswordStrengthBarModule,
    HttpServiceModule.forRoot(),
    UtilityModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      maxOpened: 1,
      autoDismiss: true,
      timeOut: 2000
      // positionClass: 'inline'
    }),
    /** Third party modules */
    NgbModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: [
          '/config/env.json',
          '/config/development.json',
          '/config/production.json',
          '/assets/i18n/en.json',
          'localhost:3000/auth/'
        ]
      }
    })
  ],
  providers: [
    AuthGuard,
    CanDeactivateGuard,
  ],
  bootstrap: [AppComponent],
  entryComponents:[UpdatePasswordComponent]
})
export class AppModule {}
