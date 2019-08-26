import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { PokiService } from './services/poki.service';
import { FormsModule } from '@angular/forms';
import { SideScrollComponent } from './side-scroll/side-scroll.component';

@NgModule({
  declarations: [
    AppComponent,
    InfiniteScrollComponent,
    SideScrollComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [PokiService,HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
