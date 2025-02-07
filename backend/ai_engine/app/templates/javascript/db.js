class QuestionIndexedDB {
  constructor(dbName = "VideoQuestionDB", version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("videos")) {
          const videoStore = db.createObjectStore("videos", { keyPath: "video_url" });
          videoStore.createIndex("section_id", "section_id", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => reject(`IndexedDB error: ${event.target.error}`);
    });
  }

  async saveVideoData(videoData) {
    await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["videos"], "readwrite");
      const store = transaction.objectStore("videos");
      const request = store.put(videoData);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject("Failed to save video data");
    });
  }

  async getVideoData(videoUrl) {
    await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["videos"], "readonly");
      const store = transaction.objectStore("videos");
      const request = store.get(videoUrl);

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = () => reject("Failed to retrieve video data");
    });
  }
}

export const questionDB = new QuestionIndexedDB();
