import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  ref1;
  songs: Observable<any[]>;
  songsRef: AngularFireList<any>;

  constructor(public navCtrl: NavController,
    public afDatabase: AngularFireDatabase,
    public alertCtrl: AlertController) {

    //afDatabase.list('/songs').push('new song');
    afDatabase.list('/songs').valueChanges().subscribe(console.log);

    //this.songs = afDatabase.list('/songs').valueChanges();    
    this.songsRef = this.afDatabase.list('/songs');
    this.songs = this.songsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }); 
  }

  addSong() {
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Enter a name for this new song you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            //const songsRef = this.afDatabase.list('/songs');
            const newSongRef = this.songsRef.push({});

            newSongRef.set({
              id: newSongRef.key,
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
}