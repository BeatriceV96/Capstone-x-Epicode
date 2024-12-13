import { UserService } from './../../services/user.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message-service.service';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../Models/message';
import { iUser } from '../../Models/i-user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  currentUserId!: number;
  currentUserProfilePicture!: string;
  currentUserName!: string;
  receiverId!: number;
  receiverUsername!: string;
  receiverProfilePicture!: string;
  messages: Message[] = [];
  newMessageContent: string = '';
  isDarkMode: boolean = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserId = currentUser.id;
      this.currentUserName = currentUser.username;
      this.currentUserProfilePicture = currentUser.profilePicture || '';

      // Aggiorna immagine del profilo attuale nel servizio
      this.messageService.updateProfilePicture(this.currentUserId, this.currentUserProfilePicture);
    } else {
      console.error('Utente non autenticato');
      return;
    }

    this.route.params.subscribe(params => {
      this.receiverId = +params['receiverId'];
      if (!this.receiverId) {
        console.error('ReceiverId non valido.');
        return;
      }
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';

      this.loadReceiverProfile();
      this.loadMessages();

      // Ascolta gli aggiornamenti delle immagini del profilo
      this.messageService.profilePictures$.subscribe(pictures => {
        if (pictures[this.receiverId]) {
          this.receiverProfilePicture = pictures[this.receiverId];
        }
        if (pictures[this.currentUserId]) {
          this.currentUserProfilePicture = pictures[this.currentUserId];
        }
      });
    });
  }

  loadReceiverProfile(): void {
    this.userService.getUserById(this.receiverId).subscribe(
      (response: iUser) => {
        this.receiverUsername = response.username;
        this.receiverProfilePicture =
          response.profilePicture?.startsWith('/uploads')
            ? 'http://localhost:5034' + response.profilePicture
            : response.profilePicture || 'assets/default-profile.png';

        // Aggiorna immagine del destinatario nel servizio
        this.messageService.updateProfilePicture(this.receiverId, this.receiverProfilePicture);
      },
      error => {
        console.error('Errore durante il caricamento del profilo del destinatario:', error);
      }
    );
  }


  loadMessages(): void {
    if (!this.currentUserId || !this.receiverId) {
      console.error('ID utente o destinatario non valido.');
      return;
    }

    this.messageService.getConversation(this.currentUserId, this.receiverId).subscribe({
      next: (response: any) => {
        this.messages = response.$values || [];
        console.log('Messaggi caricati:', this.messages);

        // Assicurati che i dettagli del destinatario siano aggiornati dai messaggi
        if (this.messages.length > 0) {
          const firstMessage = this.messages.find(
            (msg) => msg.receiverId === this.receiverId
          );
          if (firstMessage) {
            this.receiverUsername = firstMessage.receiverUsername || this.receiverUsername;
            this.receiverProfilePicture = firstMessage.receiverProfilePicture
              ? (firstMessage.receiverProfilePicture.startsWith('/uploads')
                  ? 'http://localhost:5034' + firstMessage.receiverProfilePicture
                  : firstMessage.receiverProfilePicture)
              : 'http://localhost:5034/default-profile-picture.png';
          }
        }
      },
      error: (err: any) => {
        console.error('Errore durante il caricamento della conversazione:', err);
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim()) {
      return;
    }

    const message: Partial<Message> = {
      senderId: this.currentUserId,
      receiverId: this.receiverId,
      content: this.newMessageContent.trim(),
      timestamp: new Date(),
      isRead: false,
      senderUsername: this.currentUserName,
      receiverUsername: this.receiverUsername,
      senderProfilePicture: this.currentUserProfilePicture,
      receiverProfilePicture: this.receiverProfilePicture
    };

    console.log('Sending message payload:', message);

    this.messageService.sendMessage(message).subscribe({
      next: (sentMessage: Message) => {
        console.log('Messaggio inviato:', sentMessage);
        this.messages.push(sentMessage);
        this.newMessageContent = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore durante l\'invio del messaggio:', err);
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    // Aggiorna il tema nel localStorage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }


  private updateTheme(): void {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    }
  }
}

