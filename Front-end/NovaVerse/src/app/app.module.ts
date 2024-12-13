import { EmojiPickerEventMap } from './../../node_modules/emoji-picker-element/shared.d';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './Pages/home/home.component';
import { AuthModule } from './auth/auth.module';
import { NavbarComponent } from './Main-component/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './Main-component/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './Components_/chat/chat.component';
import { NbChatModule, NbLayoutModule, NbThemeModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './Components_/notification/notification.component';
import 'emoji-picker-element';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ChatComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    CommonModule,
    AuthModule,
    RouterModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbLayoutModule,
    NbChatModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //questo per le emoji
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
