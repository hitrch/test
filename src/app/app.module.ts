import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ScoreComponent } from './score/score.component';

import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {MessageService} from 'primeng/api';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from '@angular/material/table';
import {ScrollPanelModule} from "primeng/scrollpanel";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    AppComponent,
    ScoreComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    InputTextModule, ButtonModule, ToastModule,
    MatTableModule, ScrollPanelModule, MatPaginatorModule, MatSortModule, TagModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
