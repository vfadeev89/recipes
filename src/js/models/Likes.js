export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, publisher, image_url) {
        const like = {
            id,
            title,
            publisher,
            image_url,
        };
        this.likes.push(like);

        // persist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex((el) => el.id === id);
        this.likes.splice(index, 1);

        // persist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex((el) => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) {
            // restore likes from the localStorage
            this.likes = storage;
        }
    }
}
