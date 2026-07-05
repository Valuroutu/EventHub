import { SERVER_URL } from "../services/api";

export default function resolveImage(image, placeholder) {

    if (!image) return placeholder;

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    return `${SERVER_URL}${image}`;

}
