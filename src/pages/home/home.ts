import { Component } from '@angular/core';
import { 
  NavController, 
  AlertController,
  ActionSheetController } from 'ionic-angular';
import { 
  AngularFireDatabase, 
  AngularFireList, 
  AngularFireAction, 
  DatabaseSnapshot } from 'angularfire2/database';
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
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController) {

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

  showOptions(songId, songTitle) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Song',
          role: 'destructive',
          handler: () => {
            this.removeSong(songId);
          }
        },{
          text: 'Update title',
          handler: () => {
            this.updateSong(songId, songTitle);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeSong(songId: string){
    this.songsRef.remove(songId);
  }

  updateSong(songId, songTitle){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Update the name for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songTitle
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
            this.songsRef.update(songId, {
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
}