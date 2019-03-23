import Song from './Song';
import Filepath from './Filepath'

/**
 * This classs Manages:
 * - User Settings
 * - Metadata Saving 
 * - Passing of Metadata to Table Generation
 * 
 * The Goal of This function is to remove the complete dependence of electron-settings
 * and the fact that melodii (2019.03.22) relies on Tabe.js for Saving metadata as well as table configurations.
 */
class Storage {
  constructor(path) {
    this.path  = path;
    this.ready = false; // Async Actions still need to happen
    
    /** @type {Array<Albums>} */
    this.albums = [];
    
    this.init();
  }
  
  /**
   * Initialize the Storage Instance.
   * @async
   * @private
   */
  async init() {
    const filepath = new Filepath(path);
    this.knownFiles = await filepath.getValidFiles();

    this.ready = true; // All prerequisite Async has been done.
  }


  /**
   * Goes Through all Known Songs and 
   * Creates Object Representatinos of all of them.
   * 
   */
  parseSongList() {
    const files = this.knownFiles;

    // Need to Iterate over every song, find the name of the album and create an album with that instance.
    // Store the album in some array so we know what albums exist and have a method to check whether the album has been
    // created or not. Once that is done we can then create a Song based of that, and add it to the album.

    // The end result should be an album class with all the properties filled in
    // with attention put towards this.songs which would be an array of Song classes. 
    
    files.forEach(async path => {
      const song = new Song(path, true);

      const albumName = song.metadata.common.album;

      if (!albumExists(albumName)) {
        const album = new Album(albumName);
        album.addSong(song);


        this.albums.push(album)
      }


    });

    const self = this;

    /**
     * Returns true if album is already present in List of known Albums.
     * @param {*} name 
     */
    function albumExists(name) {
      /// Please Write a Better version of this later. 
      let exists = false;

      for (let i = 0; i < self.albums.length; i++) {
        if (self.albums[i].name === name) {
          exists = true;
          break;
        }
      }

      return exists;
    }

  }





}

/**
 * Class Representation of an Album of Songs
 * 
 */
class Album {
  /** @param {String} name */
  constructor(name) {
    // Properties Here are based off what is commonly found within Mp3 Tags.
    
    /** @type {String} */
    this.name

    /** @type {Array<Song>} */
    this.songs = [];

    /** Album Artist */
    this.artist = ""
  }


  /**
   * Adds Class Representation of a Song to an Album Class
   * @param {Song} song 
   */
  addSong(song) {
    this.songs.push(song);
  }


  /**
   * Removes a Song Class from the Album 
   * @param {String} path 
   */
  removeSong(path) {
    console.error("This feature is unimplimented.")
  }

}