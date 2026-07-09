import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  constructor(public authService: AuthService) {}
}
