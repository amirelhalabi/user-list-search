import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user: any;
  loading = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.fetchUser(id);
  }

  fetchUser(id: string | null) {
    this.loading = true;
    this.http.get(`https://reqres.in/api/users/${id}`).subscribe((response: any) => {
      this.user = response.data;
      this.loading = false;
    });
  }

  goBack() {
    this.router.navigate(['/users']);
  }
}
