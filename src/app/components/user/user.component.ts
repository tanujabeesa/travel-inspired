import { Component,OnInit,Input} from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
@Input() user:any;

constructor(){}

ngOnInit(){}
}
