import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  @Input() notificPanel;

  // Dummy notifications
  notifications = [
    {
    message: 'New Notification message',
    icon: 'chat',
    time: '1 min ago',
    route: '/chat',
    color: 'accent'
  }, {
    message: 'New Upcoming Auctions',
    icon: 'chat',
    time: '4 min ago',
    route: '/chat',
    color: 'accent'
  }
  , {
    message: 'New Auctions started',
    icon: 'chat',
    time: '4 min ago',
    route: '/chat',
    color: 'accent'
  }
]


  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((routeChange) => {
        if (routeChange instanceof NavigationEnd) {
          this.notificPanel.close();
        }
    });
  }
  clearAll(e) {
    e.preventDefault();
    this.notifications = [];
  }
}
