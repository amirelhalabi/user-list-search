import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User } from './user.interface';

interface UserResponse {
    data: User[];
    total: number;          // Total number of users
    total_pages: number;    // Total pages of users
    page: number;           // Current page
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private cache = new Map<number, User[]>();
    private usersSubject = new BehaviorSubject<User[]>([]);

    constructor(private http: HttpClient) {}

    getUsers(page: number): Observable<{ users: User[], total_pages: number }> {
        if (this.cache.has(page)) {
            const users = this.cache.get(page)!;
            return new Observable<{ users: User[], total_pages: number }>(observer => {
                observer.next({ users, total_pages: this.cache.size });
                observer.complete();
            });
        }

        return this.http.get<UserResponse>(`https://reqres.in/api/users?page=${page}`).pipe(
          delay(1000),
            map(response => {
                this.cache.set(page, response.data);
                this.usersSubject.next(response.data);
                return { users: response.data, total_pages: response.total_pages };
            })
        );
    }

    searchUsers(term: string): Observable<User[]> {
        return this.usersSubject.asObservable().pipe(
            map(users => users.filter(user => user.id.toString() === term))
        );
    }
}
