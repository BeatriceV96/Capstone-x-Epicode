import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message-service.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notifications',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = []; // Array di notifiche
  userId: number = 0; // ID dell'utente corrente

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser(); // Recupera l'utente corrente
    if (user) {
      this.userId = user.id;
      this.loadNotifications(); // Carica le notifiche
    }
  }

  // Carica le notifiche
  loadNotifications(): void {
    this.messageService.getUnreadMessages(this.userId).subscribe(
      (notifications) => {
        this.notifications = notifications; // Salva le notifiche
      },
      (error) => {
        console.error('Errore nel caricamento delle notifiche:', error);
      }
    );
  }

  // Naviga alla chat con il mittente della notifica
  goToChat(senderId: number): void {
    this.router.navigate(['/chat', senderId]); // Naviga alla schermata della chat
  }

  goToNotification(notification: any): void {
    this.router.navigate([notification.link]); // Naviga al link della notifica
  }


}
