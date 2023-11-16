import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SignalingService } from './services/signaling.service';
import { CallService } from './services/call.service';
import { PlayerComponent } from './components/player/player.component';
import { VideoComponent } from './components/player/video/video.component';
import { ControlsComponent } from './components/player/controls/controls.component';

@NgModule({
	declarations: [AppComponent, PlayerComponent, VideoComponent, ControlsComponent],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		NgbModule,
		HttpClientModule
	],
	providers: [SignalingService, CallService],
	bootstrap: [AppComponent]
})
export class AppModule {}
