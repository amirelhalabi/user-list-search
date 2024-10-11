import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.interface';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    users: User[] = [];
    loading = false;
    searchTerm = '';
    currentPage = 1;
    totalPages = 1;
    errorMessage: string | null = null;
    private searchSubject = new Subject<string>();

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit() {
        this.fetchUsers(this.currentPage);
        
        this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
            this.onSearchUser(term);
        });
    }

    fetchUsers(page: number) {
        this.loading = true;
        this.userService.getUsers(page).subscribe({
            next: response => {
                this.users = response.users; 
                this.totalPages = response.total_pages; 
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    navigateToUser(id: number) {
        this.router.navigate(['/user', id]);
    }

    onSearchUser(term: string) {
        const id = parseInt(term, 10);
        if (id > 0) {
            this.errorMessage = null;
            this.navigateToUser(id);
        } else {
            this.errorMessage = 'Please enter a valid positive number.';
        }
    }

    onInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.searchTerm = input.value;
        this.searchSubject.next(this.searchTerm);
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetchUsers(this.currentPage);
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetchUsers(this.currentPage);
        }
    }
}
