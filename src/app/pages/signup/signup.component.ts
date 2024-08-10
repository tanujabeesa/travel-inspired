import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { config, finalize } from 'rxjs';
// firebase Storage and Database
import {AngularFireStorage} from '@angular/fire/compat/storage'
import {AngularFireDatabase} from '@angular/fire/compat/database'
// to compress image before uploading to the server
import { readAndCompressImage } from 'browser-image-resizer';

// image config
import { imageConfig } from '../../../utils/config';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
// default picture link when no picture is uploaded
picture: string =
'https://firebasestorage.googleapis.com/v0/b/kirana-f08b6.appspot.com/o/img.png?alt=media&token=1857e7db-06df-4e77-9756-60aa018e1460';
 // for image(percent of image uploaded)
uploadPercent: number|null|undefined = null;



ngOnInit(): void {

  }
  constructor(
    private auth:AuthService,
    private router:Router,
    private toastr: ToastrService,
    private db: AngularFireDatabase,
    private storage : AngularFireStorage

   ){}

   onSubmit(f: NgForm){

      const {email,password,username,country,bio,name} = f.form.value;


      this.auth.signUp(email, password)
      .then((res) => {
        if (res.user) {
          const { uid } = res.user;
          // path reference
          this.db.object(`/users/${uid}`)
            .set({
              id: uid,
              name: name,
              email: email,
              instaUsername: username,
              country: country,
              bio: bio,
              picture: this.picture
            })
            .then(() => {
              this.router.navigateByUrl('/signin');
              this.toastr.success("SignUp Success");
            })
            .catch((err) => {
              this.toastr.error(`SignUp Failed: ${err.message}`);
            });
        } else {
          this.toastr.error("SignUp Failed: No user returned.");
        }
      })
      .catch((err) => {
        this.toastr.error(`SignUp Failed: ${err.message}`);
      });


   }
    // to handle the upload of the file as soon as the user select the file
   async uploadFile(event:any){
        const file = event.target.files[0];

        let resizedImage = await readAndCompressImage(file, imageConfig);

        const filePath = file.name// rename the image with uuid
        const fileRef = this.storage.ref(filePath)

       const task = this.storage.upload(filePath,resizedImage);

       task.percentageChanges().subscribe((percentage)=>{
        this.uploadPercent = percentage;
       });
       task.snapshotChanges()
       .pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe((url)=>{
               this.picture = url;
               this.toastr.success("Image Upload Success");
          });
        })
       ).subscribe();
   }

}
