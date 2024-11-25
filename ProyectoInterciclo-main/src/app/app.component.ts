import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone : true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports :[RouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Si el usuario no está autenticado, redirige al login
        this.router.navigate(['/login']);
      } else {
        // Si el usuario está autenticado, se queda en la página actual
        console.log('Usuario autenticado:', user.email);
      }
    });
  }
}
