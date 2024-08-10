import { Component,OnInit,Input,OnChanges, SimpleChanges } from '@angular/core';
import{
  faThumbsUp,
  faThumbsDown,
  faShareSquare,
  faHeart,

}from "@fortawesome/free-solid-svg-icons";
import { AuthService } from '../../services/auth.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnChanges {

@Input() post:any;

faHeart= faHeart;
faThumbsUp = faThumbsUp;
faThumbsDown = faThumbsDown;
faShareSquare = faShareSquare;


uid :null|string|undefined= null;

upvote = 0;
downvote = 0;
likes = 0;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
  ){
    this.auth.getUser().subscribe((user)=>{
      this.uid = user?.uid;
    });
  }


  ngOnInit(): void {

  }
  ngOnChanges():void {
     if(this.post.vote){
      Object.values(this.post.vote).map((val:any)=>{
        if(val.upvote){
          this.upvote+= 1
        }
        if(val.downvote){
          this.downvote+= 1
        }

      })
      Object.values(this.post.like).map((val:any)=>{
        if(val.likes){
          this.likes+=1
        }
      })
     }
  }
   upvotePost(){
    console.log("UPVOTING");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`)
    .set({
      upvote: 1,
    });
   }
   downvotePost(){
    console.log("DOWNVOTING");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`)
    .set({
      downvote:1,
    });
   }
   likePost(){
    console.log("LIKING");
    this.db.object(`/posts/${this.post.id}/like/${this.uid}`)
    .set({
      likes:1,
    });
   }
   getInstaUrl(){
    return `https://instagram.com/${this.post.instaId}`
   }
   visitPlace() {
    return `http://maps.google.com/?q=${this.post.locationName}`;
  }

}
