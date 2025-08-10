import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxTonconnectService } from 'ngx-ton-connect';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(public tonConnect : NgxTonconnectService) {}

  title = 'ngx-demo-ton-connect';

  ngOnInit() {
    this.tonConnect.connect();
    console.log('Exo Test Result:', this.tonConnect.exoTest(5, 10));
  }
}
