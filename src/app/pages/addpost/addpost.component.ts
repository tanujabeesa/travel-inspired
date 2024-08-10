import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
// firebase Storage and Database
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
// to compress image before uploading to the server
import { readAndCompressImage } from 'browser-image-resizer';

// image config
import { imageConfig } from '../../../utils/config';

// uuid
import { v4 as uuidv4 } from "uuid";
import { Component, OnInit } from '@angular/core';

interface User {
  name: string;
  instaUsername: string;
  uid: string;
  // Add other properties if necessary
}

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css'] // Corrected styleUrls here
})
export class AddpostComponent implements OnInit {

  locationName?: string;
  description?: string;
  picture: string|null = null;

  user: User | null = null; // Explicitly typed user
  uploadPercent: number | null|undefined = null;

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService
  ) {
    auth.getUser().subscribe((authUser) => {
      if (authUser) {
        this.db.object<User>(`/users/${authUser.uid}`)
          .valueChanges()
          .subscribe((user) => {
            this.user = user || null; // Ensure user is properly assigned
          });
      }
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    // Verify if the user object is correctly populated
    if (this.user) {
      console.log('User before submission:', this.user);
      if (this.user.name && this.user.instaUsername) {
        const uid = uuidv4();
        this.db.object(`/posts/${uid}`)
          .set({
            id: uid,
            locationName: this.locationName || '',
            description: this.description || '',
            picture: this.picture,
            by: this.user.name,
            instaId: this.user.instaUsername,
            date: Date.now(),
          })
          .then(() => {
            this.toastr.success('Post added successfully');
            this.router.navigate(['/']); // Redirect after successful post
          })
          .catch((error) => {
            this.toastr.error('Something went wrong');
            console.error('Error adding post:', error);
          });
      } else {
        this.toastr.error('User information is incomplete');
        console.error('User information is incomplete:', this.user);
      }
    } else {
      this.toastr.error('User not found');
      console.error('User object is null');
    }
  }

  async uploadFile(event:any){
      const file = event.target.files[0];

      let resizedImage = await readAndCompressImage(file,imageConfig);

      const filePath = file.name;

      const fileRef = this.storage.ref(filePath);

      const task = this.storage.upload(filePath, resizedImage);

      task.percentageChanges().subscribe((percentage)=>{
        this.uploadPercent = percentage;
      })
      task.snapshotChanges()
     .pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe((url)=>{
          this.picture = url;
          this.toastr.success("Image Upload Success");
        })
      })
     )


      .subscribe()
  }
}
