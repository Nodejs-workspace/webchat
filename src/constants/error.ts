const errorConstants = {
    AUTH: {
        UNAUTHORIZED: "Request is unauthorized to process.",
    },
    USER: {
        NOT_FOUND_BY_ID: "User not found by id.",
        NOT_FOUND_BY_EMAIL: "User not found by email.",
        IMAGE_NOT_FOUND_FOR_PROFILE_PICTURE: "Image not found to set as profile picture.",
        VALID_USER_ID_REQUIRED: "Valid user id required.",
    },
    GROUP: {
        NOT_FOUND_BY_ID: "Group not found by id.",
        VALID_GROUP_ID_REQUIRED: "Valid group id required.",
        NAME: "Group name can't be emtpy.",
        IMAGE_NOT_FOUND_FOR_PROFILE_PICTURE: "Image not found to set as profile picture.",
    },
    MESSAGE: {
        NOT_FOUND_BY_ID: "message not found by id.",
        NAME: "Group name can't be emtpy.",
        IMAGE_NOT_FOUND_FOR_PROFILE_PICTURE: "Image not found to set as profile picture.",
    },
    ROOM: {
        NOT_FOUND_BY_ID: "Room not found by id.",
        NAME: "Room name can't be emtpy.",
        IMAGE_NOT_FOUND_FOR_PROFILE_PICTURE: "Image not found to set as profile picture.",
    },
    CLIENT_ERROR: {
        VALID_ID_REQUIRED: "valid id required",
    },
};
export default errorConstants;
