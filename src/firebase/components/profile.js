import storeImage from '../utility/storeImage';

export default {
    setProfileImage(file) {
        if (file){
            return storeImage(this, `users/${this.user.id}/image`, file);
        }
    }
}